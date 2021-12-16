import fs from 'fs';
import fp from 'lodash/fp.js';
import Heap from 'heap';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('').map(x => Number(x))),
);

const key = pt => pt.join(',');

const getGridValue = (grid, x, y) => {
	const w = grid[0].length;
	const h = grid.length;
	const mx = Math.floor(x / w);
	const my = Math.floor(y / h);
	return ((grid[y % h][x % w] - 1) + mx + my) % 9 + 1;
}

const gridSearch = (grid, w, h) => {
	const heap = new Heap((a, b) => {
		return a.cost - b.cost;
	});

	heap.push({ cost: 0, path: [[0, 0]] })
	let searching = true;
	const visited = new Set(key([0, 0]));
	const END = key([w - 1, h - 1])
	while (searching && !heap.empty()) {
		const best = heap.pop();
		const lastStep = fp.last(best.path);
		if (key(lastStep) === END) {
			searching = false;
			// console.log(best);
			return best.cost;
		}

		// Add next steps to the heap
		util.cardinal.forEach(([dx, dy]) => {
			const nx = lastStep[0] + dx;
			const ny = lastStep[1] + dy;
			const next = [nx, ny];
			const nextKey = key(next);
			if (visited.has(nextKey) || nx < 0 || ny < 0 || nx >= w || ny >= h) return;
			const path = best.path.concat([next]);
			visited.add(nextKey);
			heap.push({
				path,
				cost: best.cost + getGridValue(grid, nx, ny),
			});
		});
	}
}

export const part1 = (input) => {
	const grid = process(input);
	return gridSearch(grid, grid[0].length, grid.length);
};

export const part2 = (input) => {
	const grid = process(input);
	return gridSearch(grid, grid[0].length * 5, grid.length * 5);
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.time('part 1');
	console.log('Part 1', part1(input));
	console.timeEnd('part 1');
	console.time('part 2');
	console.log('Part 2', part2(input));
	console.timeEnd('part 2');
};
main();
