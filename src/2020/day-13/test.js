import { part1, part2 } from './index.js';

const input = `939
7,13,x,x,59,x,31,19`;

console.log(
	'Part 1 (T)',
	part1(input),
	295
);

console.log(
	'Part 2 (T)',
	part2(input),
	1068781
);

console.log(
	'Part 2 (T)',
	part2(`x
17,x,13,19`),
	3417
);

console.log(
	'Part 2 (T)',
	part2(`x
67,7,59,61`),
754018
);
