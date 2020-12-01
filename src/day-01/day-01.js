import fs from 'fs';
import fp from 'lodash/fp.js';
import { formatAsNumbers } from '../util.js';

const process = fp.flow(
	// Drop >= 2020
	fp.filter(x => x < 2020),
	// Sort ascending
	fp.sortBy(fp.identity)
);

/**
 * Find a pair of values that sum to a given input
 */
export const findSumPair = (values, sum) => {
	const result = values.find(x => {
		const compliment = sum - x;
		return fp.sortedIndexOf(compliment, values) !== -1;
	});

	// Throw exception if not found
	if (result === undefined) {
		throw new Error('No pair matches the requirement');
	}

	return [result, (sum - result)];
};


export const part1 = (input) => {
	const processed = process(input);

	// Find the first input that is a sum to 2020
	const pair = findSumPair(processed, 2020);

	return pair[0] * pair[1];
};

export const part2 = (input) => {
	const processed = process(input);

	// Looking for 3, so an outer find
	let third, output = undefined;
	for (third of processed) {
		try {
			output = findSumPair(processed, 2020 - third);
			break;
		} catch {
			// skip this failure
		}
	}
	console.log(third, ...output);
	return third * output[0] * output[1];
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(formatAsNumbers(input)));
	console.log('Part 2', part2(formatAsNumbers(input)));
};
main();
