import { part1, part2 } from './index.js';

const input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

console.log(
	'Part 1 (T)',
	part1(input),
	1588
);

console.log(
	'Part 2 (T)',
	part2(input),
	2188189693529
);
