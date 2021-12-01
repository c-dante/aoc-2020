import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {

	}, {});
	return res;
};

export const part2 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {

	}, {});
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
// main();
