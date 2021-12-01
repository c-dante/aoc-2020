import { part1, part2 } from './index.js';

const input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

console.log(
	'Part 1',
	part1(input) === 7
);

console.log(
	'Part 2',
	part2(input) === 336
);
