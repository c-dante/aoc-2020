import { part1, part2 } from './index.js';

const input = ``;

console.log(
	'Part 1 (T)',
	part1('2 * 3 + (4 * 5)'),
	26
);

console.log(
	'Part 1 (T)',
	part1('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'),
	13632
);

console.log(
	'Part 2 (T)',
	part2('1 + (2 * 3) + (4 * (5 + 6))'),
	51
);

console.log(
	'Part 2 (T)',
	part2('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'),
	23340
);
