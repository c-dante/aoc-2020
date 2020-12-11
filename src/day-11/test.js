import { part1, part2 } from './index.js';

const input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

console.log(
	'Part 1 (T)',
	part1(input),
	37
);

console.log(
	'Part 2 (T)',
	part2(input),
	26
);
