import { part1, part2 } from './index.js';

const input = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

console.log(
	'Part 1 (T)',
	part1(input, 5),
	127
);

console.log(
	'Part 2 (T)',
	part2(input, 127),
	62
);
