import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input, nthSpoken = 2020) => {
	const nums = input.split(',').map(Number);
	const spoken = new Map();
	let lastSpoken = -1;

	const speak = (n, i) => {
		lastSpoken = n;

		const result = spoken.get(n);
		if (!result) {
			spoken.set(n, { spoken: 1, a: i, b: -1 });
		} else {
			result.b = result.a;
			result.a = i;
			result.spoken++;
		}
	}

	for (let i = 0; i < nthSpoken; i++) {
		if (i < nums.length) {
			spoken.set(nums[i], { spoken: 1, a: i, b: -1 })
			lastSpoken = nums[i];
			continue;
		}

		const last = spoken.get(lastSpoken);
		if (last.spoken === 1) {
			speak(0, i);
		} else {
			speak(last.a - last.b, i);
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
