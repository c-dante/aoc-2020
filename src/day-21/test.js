import { part1, part2 } from './index.js';

const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

console.log(
	'Part 1 (T)',
	part1(input),
	5
);

console.log(
	'Part 2 (T)',
	part2(input),
	'?'
);
