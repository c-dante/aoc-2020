import { part1, part2 } from './index.js';

const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

console.log(
	'Part 1 (T)',
	part1(input),
	165
);

console.log(
	'Part 2 (T)',
	part2(`mask = 000000000000000000000000000000X1001X
	mem[42] = 100
	mask = 00000000000000000000000000000000X0XX
	mem[26] = 1`),
	208
);
