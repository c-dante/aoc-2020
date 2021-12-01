import fs from 'fs';
import fp from 'lodash/fp.js';

const process = fp.flow(
	fp.split('\n'),
);

const getValue = x => {
	const splits = x.slice(0, 7).split('');
	const colSplits = x.slice(7).split('');

	// I'm bad a binary searching apparently
	const row = splits.reduce((acc, x) => {
		const mid = Math.floor((acc[1] + acc[0]) / 2);
		if (x === 'F') {
			return [acc[0], mid];
		}
		return [mid + 1, acc[1]];
	}, [0, 127])[0];

	const col = colSplits.reduce((acc, x) => {
		const mid = Math.floor((acc[1] + acc[0]) / 2);
		if (x === 'L') {
			return [acc[0], mid];
		}
		return [mid + 1, acc[1]];
	}, [0, 7])[0];

	return row * 8 + col;
};

export const part1 = (input) => {
	const processed = process(input);
	return fp.max(processed.map(getValue));
};

export const part2 = (input) => {
	const processed = process(input);
	const allIds = processed.map(getValue).sort((a, b) => a - b);
	const missingNext = allIds.find((x, i) => i < allIds.length && allIds[i + 1] !== x + 1);
	return missingNext + 1;
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
