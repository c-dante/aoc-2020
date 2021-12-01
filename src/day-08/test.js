import { part1, part2 } from './index.js';

const input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

console.log(
	'Part 1 (T)',
	part1(input),
	5
);

console.log(
	'Part 2 (T)',
	part2(input),
	8
);
