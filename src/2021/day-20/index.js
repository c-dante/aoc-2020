import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';

const key = (pt) => `${pt.x},${pt.y}`;

const process = fp.flow(
	fp.split('\n\n'),
	([algo, input]) => {
		const lookup = algo.split('');
		const map = {};
		input.split('\n')
			.forEach((row, y) => row.split('').map((cell, x) => {
				map[key({ x, y })] = cell;
			}));
		return {
			map,
			lookup
		}
	}
);

const combine = [
	[-1, -1],
	[0, -1],
	[1, -1],

	[-1, 0],
	[0, 0],
	[1, 0],

	[-1, 1],
	[0, 1],
	[1, 1],
];

const getCell = (map, pt, allOthers = '.') => {
	const out = map[key(pt)];
	return out ? out : allOthers;
}

const enhance = (map, lookup, allOthers = '.') => {
	// Convolve around map
	const newMap = {};
	const visited = new Set();
	const go = (pt) => {
		const value = combine.reduce((acc, [dx, dy]) => {
			const v = getCell(map, { x: pt.x + dx, y: pt.y + dy }, allOthers);
			if (v === '#') {
				acc.push(1);
			} else {
				acc.push(0);
			}
			return acc;
		}, []);
		const idx = parseInt(value.join(''), 2);
		return lookup[idx];
	};

	const enhancePt = (pt) => {
		const k = key(pt);
		if (visited.has(k)) return;
		visited.add(k);
		newMap[k] = go(pt);
	}

	Object.keys(map).forEach(k => {
		const [x, y] = k.split(',').map(x => Number(x));
		const pt = { x, y };
		enhancePt(pt);
		// Include every non-visited adjacent cell
		combine.forEach(([dx, dy]) => {
			enhancePt({
				x: x + dx,
				y: y + dy
			});
		});
	});

	return newMap;
};

const printGrid = (grid, allOthers) => {
	const out = [];
	for (let y = -5; y < 25; y++) {
		const row = [];
		for (let x = -5; x < 25; x++) {
			row.push(getCell(grid, { x, y }));
		}
		out.push(row);
	}
	console.log(util.printArr(out));
}

export const part1 = (input) => {
	const res = process(input);
	const stepOne = enhance(res.map, res.lookup);
	const stepTwo = enhance(stepOne, res.lookup, res.lookup[0]);
	return Object.values(stepTwo)
		.filter(x => x === '#')
		.length;
};

export const part2 = (input) => {
	const res = process(input);
	let step = res.map;
	let flick = '.';
	for (let i = 0; i < 50cd; i++) {
		if (res.lookup[0] === '#') {
			flick = i % 2 ? '#' : '.';
		}
		step = enhance(step, res.lookup, flick)
	}
	return Object.values(step)
		.filter(x => x === '#')
		.length;
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
