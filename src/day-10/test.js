import { part1, part2 } from './index.js';

const input = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

console.log(
	'Part 1 (T)',
	part1(input),
	22 * 10
);

console.log(
	'Part 2 (T)',
	part2(`16
	10
	15
	5
	1
	11
	7
	19
	6
	12
	4`),
	8
);

console.log(
	'Part 2 (T)',
	part2(input),
	19208
);
