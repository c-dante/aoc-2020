import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

export const part1 = (input, preamble = 25) => {
	const res = input.split('\n').map(Number).reduce((acc, x) => {
		if (acc.window.length <= preamble) {
			acc.window.push(x);
			return acc;
		}

		let valid = false;
		for (let a of acc.window) {
			for (let b of acc.window) {
				if (a + b === x) {
					valid = true;
					break;
				}
			}
			if (valid) break;
		}

		if (!valid) {
			console.log('ERR', x);
		}

		acc.window.shift();
		acc.window.push(x);
		return acc;
	}, { window: [] });

	return res;
};

export const part2 = (input, toFind = 14360655) => {
	const res = input.split('\n').map(Number).reduce((acc, x) => {
		if (acc.sum === toFind) {
			return acc;
		}

		acc.range.push(x);
		acc.sum += x;

		if (acc.sum === toFind) {
			return acc;
		}

		while (acc.sum > toFind) {
			acc.sum -= acc.range.shift();
		}

		return acc;
	}, { range: [], sum: 0 })

	if (acc.sum !== toFind) {
		return -1; // error
	}

	return fp.min(res.range) + fp.max(res.range);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
