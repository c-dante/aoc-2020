import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input) => {
	const [
		estimate,
		notes
	] = input.split('\n');
	const busIds = notes.split(',').reduce((acc, x) => {
		if (!isNaN(+x)) {
			acc.push(+x);
		}
		return acc;
	}, []);

	const min = busIds.map(x => {
		return [x, Math.ceil(estimate / x) * x]
	});
	const closestAfter = fp.minBy(x => x[1] - estimate, min);

	return closestAfter[0] * (closestAfter[1] - estimate);
};

export const part2 = (input) => {
	const [
		estimate,
		notes
	] = input.split('\n');

	const busIds = notes.split(',').reduce((acc, x, i) => {
		if (!isNaN(+x)) {
			acc.push({ id: +x, i });
		}
		return acc;
	}, []);

	// And just throw it into wolfram!
	// const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
	// console.log(
	// 	busIds.map((x,i) => `${x.id}*${alpha[i]} = n + ${x.i}`)
	// 	.join(', ')
	// );

	// a[0] * 7 - n = 0
	// a[1] * 13 - a[0] * 7 = 1
	// a[2] * 59 - a[0] * 7 = 4
	// a[3] * 31 - a[0] * 7 = 6
	// a[3] * 19 - a[0] * 7 = 7

	// Apparently https://en.wikipedia.org/wiki/Chinese_remainder_theorem#Computation ?

	// How about a modded lock? each multiplier that will force two number to move together
	// like, 7 * x = n and 13 * y = n + 1
	// means there's some i that can pull out from 7 * i * x = n * i, 13 * i * y = i * (n + 1)

	return res;
};

// 17*a = 0
// 13*b = 2
// 19*c = 3

// 17*a = n
// 13*b - 2 = n
// 19*c - 3 = n

// 3417
// 201
// 263
// 180
// a = 247 m + 172, b = 323 m + 225, c = 221 m + 154, n = 4199 m + 2924, m element Z
const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	// console.time('part 2');
	// console.log('Part 2', part2(input));
	// console.timeEnd('part 2');
};
main();
