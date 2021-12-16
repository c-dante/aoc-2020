import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x),
);

export const part1 = (input) => {
	const res = process(input);
	return res;
};

const process2 = fp.flow(
	fp.split('\n'),
	fp.map(x => x),
);

export const part2 = (input) => {
	const res = process2(input);
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
