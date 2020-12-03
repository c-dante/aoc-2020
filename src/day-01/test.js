import { part1, part2 } from './index.js';

const input = `1721
979
366
299
675
1456`;

console.log(
	'Part 1',
	part1(input) === 514579
);

console.log(
	'Part 2',
	part2(input) === 241861950
);
