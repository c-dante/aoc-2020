import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split(','),
	fp.map(x => Number(x)),
	fp.sortBy(x => x),
);

export const part1 = (input) => {
	const res = process(input);
	// const mean = crabs.reduce((a, b) => a + b) / crabs.length;
	if (res.length / 2 !== Math.floor(res.length / 2)) {
		console.log('oh no');
	}
	const median = res[Math.floor(res.length / 2)];
	return res.reduce((acc, crab) => acc + Math.abs(crab - median), 0);
};

const cost = (dist, crabs) => crabs.reduce((acc, crab) => {
	const d = Math.abs(crab - dist);
	return acc + (d * (d + 1)) / 2;
}, 0);

export const part2 = (input) => {
	const crabs = process(input);
	const min = fp.min(crabs);
	const max = fp.max(crabs);
	const win = fp.minBy(x => x[1],
		fp.range(min, max + 1)
			.map(pos => [pos, cost(pos, crabs)])
	);
	return win[1];
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
