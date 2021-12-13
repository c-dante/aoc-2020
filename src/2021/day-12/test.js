import { part1, part2 } from './index.js';

const input = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

console.log(
	'Part 1 (T)',
	part1(input),
	19
);

console.log(
	'Part 2 (T)',
	part2(input),
	103
);
171282