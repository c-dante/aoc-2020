import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input) => {
	const res = input.split('\n')
		.map(x => +x)
		.reduce((acc, x) => {
			if (acc.prev !== null && acc.prev < x) {
				acc.count++;
			}
			acc.prev = x;
			return acc;
		}, {
			count: 0,
			prev: null
		});
	return res;
};

export const part2 = (input) => {
	return fp.flow(
		util.formatAsNumbers,
		util.sliding(3),
		fp.filter(x => x.length === 3),
		fp.map(fp.sum),
		fp.reduce((acc, next) => {
			if (acc.prev !== null && next > acc.prev) {
				acc.count++
			}
			acc.prev = next;
			return acc;
		}, { prev: null, count: 0 }),
		fp.get('count')
	)(input);
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
