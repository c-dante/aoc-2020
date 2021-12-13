import { part1, part2 } from './index.js';

const input = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

console.log(
	'Part 1 (T)',
	part1(input),
	17
);

console.log(
	'Part 2 (T)',
	part2(input),
	'?'
);
