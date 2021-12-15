import fs from 'fs';
import fp from 'lodash/fp.js';
import Graph from 'node-dijkstra';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('').map(x => Number(x))),
);

const key = pt => pt.join(',');

export const part1 = (input) => {
	const grid = process(input);
	const h = grid.length;
	const w = grid[0].length;

	const graph = new Graph();
	grid.forEach((row, y) => row.forEach((cell, x) => {
		const edges = util.cardinal.reduce((acc, [dx, dy]) => {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= w || ny >= h) return acc;
			acc[key([nx, ny])] = grid[ny][nx];
			return acc;
		}, {});
		graph.addNode(key([x, y]), edges);
	}))

	const path = graph.path(key([0, 0]), key([w - 1, h - 1]));
	return path.slice(1).map(a => {
		const [x, y] = a.split(',').map(Number);
		return grid[+y][+x];
	}).reduce((a, b) => a + b);
};

export const part2 = (input) => {
	const grid = process(input);
	const bh = grid.length;
	const bw = grid[0].length;
	for (let i = 0; i < 4; i++) {
		grid.push(
			...grid.slice(i * bh, (i + 1) * bh)
				.map(row => row.map(x => (x % 9) + 1))
		);
	}
	for (let i = 0; i < 4; i++) {
		grid.forEach(row => {
			row.push(
				...row.slice(i * bw, (i + 1) * bw)
					.map(x => (x % 9) + 1)
			);
		});
	}
	const h = grid.length;
	const w = grid[0].length;


	const graph = new Graph();
	grid.forEach((row, y) => row.forEach((cell, x) => {
		const edges = util.cardinal.reduce((acc, [dx, dy]) => {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= w || ny >= h) return acc;
			acc[key([nx, ny])] = grid[ny][nx];
			return acc;
		}, {});
		graph.addNode(key([x, y]), edges);
	}))

	const path = graph.path(key([0, 0]), key([w - 1, h - 1]));
	return path.slice(1).map(a => {
		const [x, y] = a.split(',').map(Number);
		return grid[+y][+x];
	}).reduce((a, b) => a + b);
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
