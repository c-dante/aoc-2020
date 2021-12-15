import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n\n'),
	x => {
		const [start, rules] = x;

		const ruleSet = rules.split('\n')
			.map(x => x.split(' -> '))
			.reduce((acc, rule) => {
				if (!acc.parent[rule[0]]) {
					acc.parent[rule[0]] = [];
				}
				acc.parent[rule[0]].push(rule[1]);

				if (!acc.child[rule[1]]) {
					acc.child[rule[1]] = [];
				}
				acc.child[rule[1]].push(rule[0]);
				return acc;
			}, {
				parent: {},
				child: {},
			});

		return { start, ruleSet, rules };
	}
);

export const part1 = (input) => {
	const { start, ruleSet } = process(input);

	let arr = start.split('');
	for (let i = 0; i < 10; i++) {
		const next = util.sliding(2)(arr).slice(1)
			.map((pair, x) => {
				// console.log(pair);
				const out = [];
				if (x > 0) {
					return [ruleSet.parent[pair.join('')][0], pair[1]];
				} else {
					return [pair[0], ruleSet.parent[pair.join('')][0], pair[1]];
				}
			});
		arr = fp.flatten(next);
	}
	const counts = fp.countBy(x => x, arr);
	// console.log(counts);
	const pairs = fp.toPairs(counts);
	return fp.maxBy(x => x[1], pairs)[1] - fp.minBy(x => x[1], pairs)[1];
};

const merge = (l, r) => {
	const out = { ...l };
	Object.keys(r).forEach(k => {
		out[k] = (out[k] ?? 0) + r[k];
	});
	return out;
}

export const part2 = (input) => {
	const { start, ruleSet } = process(input);
	const seeds = util.sliding(2)(start.split(''))
		.slice(1);
	// .slice(0, 1);
	const memo = {};

	const DEPTH = 40;
	const recurse = (next, depth = 0) => {
		const key = `${next.join('')}${depth}`;
		if (memo[key]) {
			trip = trip + 1;
			return memo[key];
		}

		const insert = ruleSet.parent[next.join('')][0];

		if (depth < DEPTH - 1) {
			// Traverse left
			const left = recurse([next[0], insert], depth + 1);

			// Traverse right
			const right = recurse([insert, next[1]], depth + 1);
			memo[key] = merge(left, right);

			// Add in the dropped head
			if (depth === 0) {
				memo[key][next[0]]++;
			}
			return memo[key];
		}

		// console.log(next[0], insert, next[1]);
		// console.log(insert, next[1]);
		memo[key] = {};
		// memo[key][next[0]] = (memo[key][next[0]] ?? 0) + 1;
		memo[key][insert] = (memo[key][insert] ?? 0) + 1;
		memo[key][next[1]] = (memo[key][next[1]] ?? 0) + 1;
		return memo[key];
	};

	const res = seeds.map(seed => recurse(seed))
		.reduce(merge);

	const pairs = fp.toPairs(res);
	return fp.maxBy(x => x[1], pairs)[1] - fp.minBy(x => x[1], pairs)[1];
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	// console.time('part 2');
	console.log('Part 2', part2(input));
	// console.timeEnd('part 2');
};
main();
