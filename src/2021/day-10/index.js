import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('')),
);

const open = '[(<{'.split('');
const openSet = new Set(open);
const close = '])>}'.split('');
const closeSet = new Set(close);
const score = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
};

export const part1 = (input) => {
	const res = process(input)
		.reduce((acc, line) => {
			const stack = [];
			let valid = true;
			line.forEach(char => {
				if (!valid) return;
				if (openSet.has(char)) {
					stack.push(char);
				} else {
					const last = stack.pop();
					const idx = open.indexOf(last);
					if (close[idx] !== char) {
						valid = false;
						acc += score[char];
						console.log(char);
						return;
					}
				}
			});
			return acc;
		}, 0);
	return res;
};

const scoreTwo = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
}

export const part2 = (input) => {
	const res = process(input)
		.reduce((acc, line) => {
			const stack = [];
			let valid = true;
			line.forEach(char => {
				if (!valid) return;
				if (openSet.has(char)) {
					stack.push(char);
				} else {
					const last = stack.pop();
					const idx = open.indexOf(last);
					if (close[idx] !== char) {
						valid = false;
						return;
					}
				}
			});

			if (valid) {
				stack.reverse();
				acc.push(stack.reduce((x, char) => {
					const idx = open.indexOf(char);
					return x * 5 + scoreTwo[close[idx]];
				}, 0));
			}
			return acc;
		}, []);
	const sorted = fp.sortBy(x => -x, res);

	return sorted[Math.floor(sorted.length / 2)];
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
