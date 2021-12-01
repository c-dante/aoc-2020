import fs from 'fs';
import fp from 'lodash/fp.js';

const tree = '#';

const process = fp.flow(
	fp.split('\n'),
	fp.map(fp.split('')),
);

const getTrees = (processed, x, y) => {
	let selfX = 0;
	let selfY = 0;
	let count = 0;
	while (selfY < processed.length) {
		if (processed[selfY][selfX] === tree) {
			count++;
		}
		selfY += y;
		selfX = (selfX + x) % processed[0].length;
	}
	return count;
}

export const part1 = (input) => {
	const processed = process(input);
	return getTrees(processed, 3, 1);
};

export const part2 = (input) => {
	const processed = process(input);
	return [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2],
	].reduce((acc, [x, y]) => {
		return acc * getTrees(processed, x, y);
	}, 1);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
