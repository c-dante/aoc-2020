import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input) => {
	// 1, 2, 3 lower
	const res = input.split('\n').map(Number);
	// res.push(0);
	// res.push(fp.max(res) + 3);
	res.sort((a, b) => a - b);

	const [a, b] = res.reduce((acc, next, i) => {
		if (i === 0) {
			return acc;
		}

		switch (next - res[i - 1]) {
			case 1: return [acc[0] + 1, acc[1]];
			case 2: return acc;
			case 3: return [acc[0], acc[1] + 1];
			default: {
				console.log('???', { acc, next, i });
				return acc;
			};
		}
	}, [0, 0]);
	return a * b;
};

const fact = (x) => {
	let s = 1;
	while (x > 0) {
		s *= x;
		x--;
	}
	return s;
}

export const part2 = (input) => {
	const res = input.split('\n').map(Number);
	res.push(fp.max(res) + 3);
	res.sort((a, b) => a - b);

	const cache = {
		0: 1,
	};
	res.forEach(x => {
		let local = 0;
		if (cache[x - 1]) {
			local += cache[x - 1];
		}
		if (cache[x - 2]) {
			local += cache[x - 2];
		}
		if (cache[x - 3]) {
			local += cache[x - 3];
		}
		cache[x] = local;
	});

	return cache[fp.last(res)];
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
