import { POINT_CONVERSION_COMPRESSED } from 'constants';
import fs from 'fs';
import fp from 'lodash/fp.js';

const process = fp.flow(
	fp.split('\n'),
);

export const part1 = (input) => {
	const processed = process(input);

	const out = processed.reduce((acc, x) => {
		// Produce group
		if (x === '') {
			acc.groups.push(Object.keys(acc.ans).length);
			return { groups: acc.groups, ans: {} };
		}

		x.split('').forEach(y => {
			if (!acc.ans[y]) {
				acc.ans[y] = 0;
			}
			acc.ans[y]++;
		});

		return acc;
	}, { groups: [], ans: {} })

	return fp.sum(out.groups) + Object.keys(out.ans).length;
};

export const part2 = (input) => {
	const processed = process(input);

	const out = processed.reduce((acc, x) => {
		if (x === '') {
			const total = Object.values(acc.ans).reduce((x, set) => {
				if (set === acc.total) {
					return x + 1;
				}
				return x;
			}, 0);
			acc.groups.push(total);

			return { groups: acc.groups, ans: {}, total: 0 };
		}

		acc.total++;
		x.split('').forEach(y => {
			if (!acc.ans[y]) {
				acc.ans[y] = 0;
			}
			acc.ans[y]++;
		});

		return acc;
	}, { groups: [], ans: {}, total: 0 })

	const total = Object.values(out.ans).reduce((x, set) => {
		if (set === out.total) {
			return x + 1;
		}
		return x;
	}, 0);

	return fp.sum(out.groups) + total;
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
