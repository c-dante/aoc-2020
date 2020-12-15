import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input, nthSpoken = 2020) => {
	const nums = input.split(',').map(Number);
	const spoken = new Map();
	let lastSpoken = 0;

	for (let i = 0; i < nthSpoken; i++) {
		if (i < nums.length) {
			spoken.set(nums[i], { spoken: 1, turn: [i] });
			lastSpoken = nums[i];
			// console.log(nums[i]);
			continue;
		}

		const last = spoken.get(lastSpoken);
		if (last.spoken === 1) {
			const now = spoken.get(0) ?? { spoken: 0, turn: [] };
			now.spoken++;
			now.turn.unshift(i);
			if (now.turn.length > 2) {
				now.turn.pop();
			}
			lastSpoken = 0;
			spoken.set(0, now);
			// console.log(lastSpoken);
		} else {
			const speak = last.turn[0] - last.turn[1];
			const now = spoken.get(speak) ?? { spoken: 0, turn: [] };
			now.spoken++;
			now.turn.unshift(i);
			if (now.turn.length > 2) {
				now.turn.pop();
			}
			spoken.set(speak, now);
			lastSpoken = speak;
			// console.log(speak);
		}
	}
	return lastSpoken;
};

export const part2 = (input) => part1(input, 30000000);

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.time('part 1');
	console.log('Part 1', part1(input));
	console.timeEnd('part 1');
	console.time('part 2');
	console.log('Part 2', part2(input));
	console.timeEnd('part 2');
};
main();
