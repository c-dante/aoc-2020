import { part1, part2 } from './index.js';

const input = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;

console.log(
	'Part 1',
	part1(input) === 2
);

console.log(
	'Part 2',
	part2(input) === 1
);
