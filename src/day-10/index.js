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
	res.push(0);
	res.push(fp.max(res) + 3);
	res.sort((a, b) => a - b);

	const deltas = res.slice(1).map((x, i) => x - res[i]);
	const out = deltas.join('')
		.split('3')
		.filter(x => x.length > 0)
		.map(x => fact(x.length))
		.reduce((acc, x) => acc * x, 1);

// 0 1 2 3 4 7
//   1 1 1 3 YES
//     2 1 3 YES
//   1   2 3 YES
//   1 1   4 NO
//       3 3 YES

// 0 1 2 3 4 7
//   1 1 1 1 3 YES
//     2 1 1 3 YES
//       3 1 3 YES


// 1 1 3
//   2 3

	return out;
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	// console.log('Part 2', part2(input));
};
main();
