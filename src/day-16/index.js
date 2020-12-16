import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

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
			low: fp.sortBy(x=> x, a.split('-').map(Number)),
			high: fp.sortBy(x=> x, b.split('-').map(Number))
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

const inRange = ([low, high], x) => low <= x && high >= x
export const part2 = (input) => {
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

	const possibleFields = fields.map(x => {
		const [_, field, a, b] = /([\w\s]+): ([\d\-]+) or ([\d\-]+)/.exec(x);
		return {
			field,
			a: fp.sortBy(x=> x, a.split('-').map(Number)),
			b: fp.sortBy(x=> x, b.split('-').map(Number)),
			columns: new Set(fields.map((_, i) => i)),
		};
	});

	const asd = mine[0].split(',').map(Number);
	nearby
		.map(x => x.split(',').map(Number))
		.concat([asd])
		.forEach(ticket => {
			if (ticket.every(
				n => possibleFields.some(field => inRange(field.a, n) || inRange(field.b, n))
			)) {
				ticket.forEach((n, col) => {
					possibleFields.forEach(field => {
						if (!inRange(field.a, n) && !inRange(field.b, n)) {
							field.columns.delete(col);

							if (field.columns.size === 1) {
								const x = [...field.columns];
								field.col = x[0];
								possibleFields.forEach(x => x.columns.delete(field.col));
							}
						}
					});
				});
			}
		});

		let f = possibleFields.slice();
		while (f.length) {
			f = f.filter(x => {
				if (x.col !== undefined || x.columns.size === 0) {
					return false;
				}
				if (x.columns.size === 1) {
					x.col = [...x.columns][0];
					possibleFields.forEach(n => n.columns.delete(x.col));
				}
				return true;
			});
		}

	// find my departure
	// multiply them together

	return possibleFields.filter(x => x.field.startsWith('departure'))
		.map(x => asd[x.col])
		.reduce((a, b) => a * b);
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
