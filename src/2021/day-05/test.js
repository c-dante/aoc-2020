import { part1, part2 } from './index.js';

const input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

console.log(
	'Part 1 (T)',
	part1(input),
	5
);

console.log(
	'Part 2 (T)',
	part2(input),
	12
);
