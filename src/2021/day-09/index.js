import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('').map(Number)),
);

export const part1 = (input) => {
	const grid = process(input);
	let risk = 0;
	const low = grid.reduce((acc, row, x) => {
		row.forEach((cell, y) => {
			const lowPt = util.cardinal.every(
				([dx, dy]) => {
					const pt = grid?.[x + dx]?.[y + dy];
					return fp.isNil(pt) || pt > cell;
				}
			);
			if (lowPt) {
				acc.add([x, y].join(','));
				risk += cell + 1;
			}
		});
		return acc;
	}, new Set());
	return risk;
};

export const part2 = (input) => {
	const grid = process(input);
	const low = grid.reduce((acc, row, x) => {
		row.forEach((cell, y) => {
			const lowPt = util.cardinal.every(
				([dx, dy]) => {
					const pt = grid?.[x + dx]?.[y + dy];
					return fp.isNil(pt) || pt > cell;
				}
			);
			if (lowPt) {
				acc.push([x, y]);
			}
		});
		return acc;
	}, []);

	const knownBasins = new Set();
	const flowBasin = (start, knownBasins) => {
		const toCheck = [start];
		const visited = new Set();
		const inBasin = new Set([start.join(',')]);
		while (toCheck.length > 0) {
			const pt = toCheck.pop();
			const key = pt.join(',');
			if (knownBasins.has(key)) {
				return null;
			}
			if (visited.has(key)) continue;
			visited.add(key);

			// Add each neighbor to check
			util.cardinal.forEach(([dx, dy]) => {
				const next = [pt[0] + dx, pt[1] + dy]
				const v = grid?.[next[0]]?.[next[1]];
				if (fp.isNil(v) || v === 9) return;

				// Otherwise, this is a basin point + recurse
				toCheck.push(next);
				inBasin.add(next.join(','));
			});
		}
		return inBasin;
	}

	const uniqueBasins = low.reduce((acc, seed) => {
		const basin = flowBasin(seed, knownBasins);
		if (basin === null) {
			return acc;
		}

		acc.basins.push(basin);
		basin.forEach(key => acc.allKnownBasins.add(key));
		return acc;
	}, {
		basins: [],
		allKnownBasins: new Set(),
	});

	const sorted = fp.sortBy(x => -x.size, uniqueBasins.basins);
	// console.log(sorted);

	return sorted.slice(0, 3).reduce((acc, x) => acc * x.size, 1);
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
