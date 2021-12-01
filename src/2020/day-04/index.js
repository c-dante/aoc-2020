import fs from 'fs';
import fp from 'lodash/fp.js';
import { emptyLineGroupedReduce } from '../../util.js';

const expected = {
	'byr': x => x.length === 4 && (+x >= 1920 && +x <= 2002),
	'iyr': x => x.length === 4 && (+x >= 2010 && +x <= 2020),
	'eyr': x => x.length === 4 && (+x >= 2020 && +x <= 2030),
	'hgt': x => {
		const res = /(\d+)(in|cm)/.exec(x);
		if (!res) {
			return false;
		}
		if (res[2] === 'in') {
			return +res[1] >= 59 && +res[1] <= 76;
		}
		return +res[1] >= 150 && +res[1] <= 193;
	},
	'ecl': x => 'amb blu brn gry grn hzl oth'.split(' ').includes(x),
	'pid': x => x.length === 9 && !isNaN(+x),
	'hcl': x => /^#[0-9a-f]{6}$/.test(x)
};

export const part1 = (input) => {
	const res = emptyLineGroupedReduce(
		input,

		(acc, next) => {
			next.split(' ').forEach(y => {
				const tok = y.split(':')[0];
				acc.delete(tok);
			});
			return acc;
		},
		() => new Set(Object.keys(expected)),

		(acc) => {
			if (acc.size === 0) {
				return 1;
			}
			return 0;
		}
	);

	return fp.sum(res);
};

export const part2 = (input) => {
	const res = emptyLineGroupedReduce(
		input,

		(acc, next) => {
			next.split(' ').forEach(y => {
				const [tok, value] = y.split(':');
				if (expected[tok] && expected[tok](value)) {
					acc.delete(tok);
				}
			});
			return acc;
		},
		() => new Set(Object.keys(expected)),

		(acc) => {
			if (acc.size === 0) {
				return 1;
			}
			return 0;
		}
	);

	return fp.sum(res);
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
