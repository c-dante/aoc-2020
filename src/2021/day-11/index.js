import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x),
);

export const part1 = (input) => {
	const { grid } = util.parseGrid(input, x => Number(x), '')
	let flashes = 0;
	let i = 0;
	while (1) {
		i++;
		const toSpark = [];
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				grid[y][x]++;
				if (grid[y][x] > 9) {
					toSpark.push([x, y])
				}
			}
		}

		const sparked = new Set();
		while (toSpark.length > 0) {
			const [sx, sy] = toSpark.pop();
			const k = `${sx},${sy}`;
			if (sparked.has(k)) continue;
			sparked.add(k);

			util.rose.forEach(([dx, dy]) => {
				const nx = dx + sx;
				const ny = dy + sy;
				const v = grid[nx]?.[ny];
				if (!fp.isNil(v) && !sparked.has(`${nx},${ny}`)) {
					grid[ny][nx]++;
					if (grid[ny][nx] > 9) {
						toSpark.push([nx, ny]);
					}
				}
			});
		}
		flashes += sparked.size;

		if (sparked.size === grid.length * grid[0].length) {
			return i;
		}
		sparked.forEach((k) => {
			const v = k.split(',');
			grid[+v[1]][+v[0]] = 0;
		});
	}
	return flashes;
};

const process2 = fp.flow(
	fp.split('\n'),
	fp.map(x => x),
);

export const part2 = (input) => {
	const res = process2(input)
		.reduce((acc, x) => {
			return acc;
		}, {

		});
	return res;
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
