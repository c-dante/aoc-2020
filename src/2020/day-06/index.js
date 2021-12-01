import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input) => {
	const out = util.emptyLineGroupedReduce(
		input,

		(acc, next) => {
			next.split('').forEach(c => {
				if (!acc[c]) acc[c] = 0;
				acc[c]++;
			})
			return acc;
		},
		() => ({}),

		acc => Object.keys(acc).length,
	);
	return fp.sum(out);
};

export const part2 = (input) => {
	const out = util.emptyLineGroupedReduce(
		input,

		(acc, next) => {
			acc.total++;
			next.split('').forEach(c => {
				if (!acc.letters[c]) acc.letters[c] = 0;
				acc.letters[c]++;
			})
			return acc;
		},
		() => ({ letters: {}, total: 0 }),

		acc => Object.values(acc.letters).filter(x => x === acc.total).length,
	);
	return fp.sum(out);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
