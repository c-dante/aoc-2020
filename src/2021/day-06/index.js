import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split(','),
	fp.map(x => Number(x))
);

export const part1 = (input) => {
	const res = process(input);

	for (let day = 0; day < 80; day++) {
		res.forEach((fish, i) => {
			if (fish === 0) {
				res[i] = 6;
				res.push(8);
			} else {
				res[i]--;
			}
		});
		// console.log(res);
	}
	return res.length;
};

const process2 = fp.flow(
	fp.split('\n'),
	fp.map(x => x)
);

export const part2 = (input) => {
	const fish = process(input)
		.reduce((acc, x) => {
			acc[x]++;
			return acc;
		}, new Array(9).fill(0));

	for (let i = 0; i < 256; i++) {
		const toSpawn = fish.shift();
		fish[6] += toSpawn;
		fish.push(toSpawn);
	}
	return fish.reduce((a, b) => a + b);
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
