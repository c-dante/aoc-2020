import { part1, part2 } from './index.js';

const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

const input2 = `#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########`;

console.log(
	'Part 1 (T)',
	part1(input),
	12521
);

console.log(
	'Part 2 (T)',
	part2(input2),
	44169
);
