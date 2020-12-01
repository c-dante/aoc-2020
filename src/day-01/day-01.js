import fs from 'fs';
import fp from 'lodash/fp.js';
import { formatAsNumbers } from '../util.js';

const process = fp.flow(
	// Drop >= 2020
	fp.filter(x => x < 2020),
	// Sort ascending
	fp.sortBy(fp.identity)
);

export const findSum = (input) => {
	const processed = process(input);

	// Find the first input that is a sum
	const result = processed.find(x => {
		const compliment = 2020 - x;
		return fp.sortedIndexOf(compliment, processed) !== -1;
	});

	// Throw exception if not found
	if (result === undefined) {
		throw new Error('No pair matches the requirement');
	}

	return result * (2020 - result);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log(findSum(formatAsNumbers(input)));
};
main();
