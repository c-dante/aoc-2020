import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.filter(x => x !== ''),
	fp.map(x => {
		const [from, to] = x.split(' -> ')
			.map(a => {
				const [x, y] = a.split(',').map(Number);
				return { x, y };
			});
		return { from, to };
	}),
	fp.filter(({ from, to }) => from.x === to.x || from.y === to.y)
);

const visit = (acc, x, y) => {
	if (!acc.grid[x]) {
		acc.grid[x] = [];
	}
	if (!acc.grid[x][y]) {
		acc.grid[x][y] = 0;
	}
	acc.grid[x][y]++;
	if (acc.grid[x][y] >= 2) {
		acc.sum.add(`${x},${y}`);
	}
}

export const part1 = (input) => {
	const res = process(input)
		.reduce((acc, x) => {
			const sortedX = fp.sortBy(fp.identity, [x.from.x, x.to.x]);
			const orderedX = fp.range(sortedX[0], sortedX[1] + 1);

			const sortedY = fp.sortBy(fp.identity, [x.from.y, x.to.y]);
			const orderedY = fp.range(sortedY[0], sortedY[1] + 1);
			orderedX.forEach(x => {
				orderedY.forEach(y => {
					visit(acc, x, y);
				})
			});
			return acc;
		}, {
			grid: [],
			sum: new Set(),
		});
	return res.sum.size;
};

const process2 = fp.flow(
	fp.split('\n'),
	fp.filter(x => x !== ''),
	fp.map(x => {
		const [from, to] = x.split(' -> ')
			.map(a => {
				const [x, y] = a.split(',').map(Number);
				return { x, y };
			});
		return { from, to };
	}),
	// fp.filter(({ from, to }) => from.x === to.x || from.y === to.y)
);

export const part2 = (input) => {
	const res = process2(input)
		.reduce((acc, x) => {
			let pt = { ...x.from };
			const [dx, dy] = util.dxDy(
				x.from.x, x.from.y,
				x.to.x, x.to.y
			).map(x => Math.round(x));

			while (pt.x !== x.to.x || pt.y !== x.to.y) {
				visit(acc, pt.x, pt.y);
				pt.x += dx;
				pt.y += dy;
			}
			visit(acc, pt.x, pt.y);

			return acc;
		}, {
			grid: [],
			sum: new Set(),
		});
	return res.sum.size;
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
// main();
