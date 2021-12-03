import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input) => {
	const res = input.split('\n')
		.map(x => x.split(' '))
		.reduce((acc, [dir, num]) => {
			if (dir === 'forward') {
				acc.x += +num;
			}
			if (dir === 'down') {
				acc.y += +num;
			}
			if (dir === 'up') {
				acc.y -= +num;
			}
			return acc;
		}, { x: 0, y: 0 });

	return res.x * res.y;
};

export const part2 = (input) => {
	const res = input.split('\n')
		.map(x => x.split(' '))
		.reduce((acc, [dir, num]) => {
			if (dir === 'forward') {
				acc.x += +num;
				acc.z += acc.aim * (+num)
			}
			if (dir === 'down') {
				acc.aim += +num;
			}
			if (dir === 'up') {
				acc.aim -= +num;
			}
			return acc;
		}, { aim: 0, x: 0, z: 0 });

	return res.x * res.z;
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
