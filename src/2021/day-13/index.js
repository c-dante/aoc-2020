import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n\n'),
	x => {
		const [c, ins] = x;
		let max = [0, 0];
		const pts = c.split('\n').map(row => {
			const [x, y] = row.split(',').map(n => Number(n));
			max[0] = Math.max(x, max[0]);
			max[1] = Math.max(y, max[1]);
			return { x, y };
		});
		console.log({ max, pts });
		let grid = new Array(max[1] + 1).fill(0).map(
			() => new Array(max[0] + 1).fill(0)
		);
		pts.forEach(pt => {
			grid[pt.y][pt.x] = 1;
		});
		ins.split('\n').slice().forEach(x => {
			const [head, z] = x.split('=');
			// console.log(head, +z);
			if (head.endsWith('x')) {
				const left = grid.map(row => row.slice(0, +z));
				const right = grid.map(row => row.slice(+z + 1))
				// console.log(util.printArr(left));
				// console.log('---');
				// console.log(util.printArr(right));
				let dots = 0;
				right.map(x => x.reverse()).forEach((row, y) => {
					row.forEach((v, x) => {
						// console.log(top[y]);
						left[y][x] = Math.max(v, left[y][x]);
						if (left[y][x] > 0) {
							dots++;
						}
					})
				});
				grid = left;
			} else {
				const top = grid.slice(0, +z).map(x => x.slice());
				const bottom = grid.slice(+z + 1);
				// console.log(util.printArr(top));
				// console.log('---');
				// console.log(util.printArr(bottom));
				let dots = 0;
				bottom.reverse().forEach((row, y) => {
					row.forEach((v, x) => {
						// console.log(top[y]);
						top[y][x] += Math.max(v, top[y][x]);
						if (top[y][x] > 0) {
							dots++;
						}
					})
				});
				grid = top;
			}
		});
		console.log(util.printArr(grid.map(
			row => row.map(c => c > 0 ? '#' : ' ')
		)));
		return [];
	},
);

export const part1 = (input) => {
	const res = process(input)
		.reduce((acc, x) => {
			return acc;
		}, {

		});
	return res;
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
