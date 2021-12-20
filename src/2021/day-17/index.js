import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';

const process = fp.flow(
	fp.split(', '),
	([l, r]) => {
		const [xMin, xMax] = l.split('=')[1].split('..').map(x => Number(x));
		const [yMin, yMax] = r.split('=')[1].split('..').map(x => Number(x));
		return { xMin, xMax, yMin, yMax };
	}
);

const GRAV = 1;
const DRAG = 1;
const runSim = (x, y, res) => {
	const v = { x, y };
	const probe = { x: 0, y: 0 };
	let max = 0;
	const inTarget = (x, y) =>
		x >= res.xMin
		&& x <= res.xMax
		&& y >= res.yMin
		&& y <= res.yMax;
	while (
		!inTarget(probe.x, probe.y)
		&& probe.y >= res.yMin
		&& probe.x <= res.xMax
	) {
		probe.x += v.x;
		probe.y += v.y;
		max = Math.max(max, probe.y);
		if (v.x !== 0) {
			v.x = v.x > 0 ? v.x - DRAG : v.x + DRAG;
		}
		v.y -= GRAV;
	}

	return {
		hit: inTarget(probe.x, probe.y),
		max,
	};
}

export const part1 = (input) => {
	const res = process(input);
	// How high can you make the probe go while still reaching the target area?

	let max = 0;
	let count = new Set();
	for (let y = 500; y > -200; y--) {
		for (let x = 300; x > 0; x--) {
			const done = runSim(x, y, res);
			if (done.hit) {
				count.add(`${x},${y}`);
				max = Math.max(max, done.max);
			}
		}
	}
	return { max, count: count.size };
	// console.log(runSim(6, 9, res));
	// console.log('???');
};

export const part2 = (input) => {
	const res = process(input);
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
