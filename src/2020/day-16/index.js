import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {
		if (x === '') {
			acc.out.push(acc.temp)
			acc.temp = []
		} else {
			acc.temp.push(x);
		}
		return acc;
	}, {
		out: [],
		temp: [],
	});
	const [fields, mine] = res.out;
	const nearby = res.temp;
	mine.shift();
	nearby.shift();

	const ranges = fields.map(x => {
		const [_, field, a, b] = /([\w+\s]): ([\d\-]+) or ([\d\-]+)/.exec(x);
		return {
			field,
			low: fp.sortBy(x => x, a.split('-').map(Number)),
			high: fp.sortBy(x => x, b.split('-').map(Number))
		};
	})
		.flatMap(x => [x.low, x.high]);

	const errorRate = nearby
		.flatMap(x => x.split(','))
		.map(Number)
		.reduce((acc, x) => {
			if (!ranges.some(([low, high]) => low <= x && high >= x)) {
				return acc += x;
			}
			return acc;
		}, 0)

	return errorRate;
};

export const part2 = (input) => {
	const [
		rawFields,
		rawMine,
		rawNearby,
	] = util.emptyLineGroupedReduce(input);

	// Compute fields
	const toRange = fp.flow(
		fp.split('-'),
		fp.map(Number),
		fp.sortBy(fp.identity)
	);

	const fields = rawFields.map(str => {
		const [_, field, a, b] = /([\w\s]+): ([\d\-]+) or ([\d\-]+)/.exec(str);
		const ranges = [toRange(a), toRange(b)];
		return {
			field,
			ranges,
			inRange: x => ranges.some(([min, max]) => min <= x && x <= max),
			columns: new Set(fp.range(0, rawFields.length)),
			col: undefined, // placeholder for locked in column
		};
	});

	const mine = rawMine.pop().split(',').map(Number);

	const toSolve = new Set(fields);
	const deduceExclude = (field, column) => {
		field.columns.delete(column);
		if (field.columns.size === 1) {
			const solvedColumn = [...field.columns][0];
			field.col = solvedColumn;
			toSolve.delete(field);
			toSolve.forEach(otherField => otherField.columns.delete(solvedColumn));
		}
	}

	// Solve for field columns
	rawNearby
		.slice(1)
		.map(x => x.split(',').map(Number))
		.concat([mine])
		.forEach(ticket => {
			if (toSolve.length === 0) {
				return false;
			}

			// For each ticket, assert some field is valid for it
			// Collect all non-solved invalid fields
			const candidates = [];
			let validFields = 0;
			for (let column = 0; column < ticket.length; column++) {
				let hasValid = false;
				fields.forEach(field => {
					if (!field.inRange(ticket[column])) {
						if (field.col === undefined) {
							candidates.push({ field, column });
						}
					} else {
						hasValid = true;
					}
				});
				if (hasValid) {
					validFields++;
				}
			}

			if (validFields === ticket.length) {
				candidates.forEach(({ field, column }) => deduceExclude(field, column));
			}
		});

	// Deduce remaining fields
	while (toSolve.size > 0) {
		toSolve.forEach(field => {
			if (field.columns.size === 1) {
				toSolve.delete(field);
				const solvedColumn = [...field.columns][0];
				field.col = solvedColumn;
				toSolve.forEach(otherField => otherField.columns.delete(solvedColumn));
			}
		});
	}

	// find my departure
	// multiply them together
	return fields.filter(x => x.field.startsWith('departure'))
		.map(x => mine[x.col])
		.reduce((a, b) => a * b, 1);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	// console.time('part 2');
	console.log('Part 2', part2(input));
	// console.timeEnd('part 2');
};
main();
