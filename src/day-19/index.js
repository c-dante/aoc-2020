import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

const parseRule = str => {
	const [id, rule] = str.split(': ');
	if (rule.startsWith('"')) {
		return { id, literal: rule[1] };
	}

	const or = rule.split('|')
		.map(x => x.trim().split(' '));
	return { id, or };
}

export const part1 = (input, override = false) => {
	const [rules, messages] = util.emptyLineGroupedReduce(input);
	const byId = fp.keyBy('id', rules.map(parseRule));

	if (override) {
		if (byId[8]) {
			byId[8] = parseRule('8: 42 8 | 42');
		}

		if (byId[11]) {
			byId[11] = parseRule('11: 42 11 31 | 42 31');
		}
	}

	const wrappedExec = (x, rule) => {
		const explored = new Set();
		const branches = [[x, rule]];

		const exec = (x, rule) => {
			if (x === '') return [false, x];
			if (rule.literal) {
				if (x[0] === rule.literal) {
					return [true, x.slice(1)];
				}

				return [false, x];
			}

			const candidate = [];
			for (const ruleIds of rule.or) {
				const res = ruleIds.reduce(
					(acc, id) => {
						if (!acc[0]) {
							return [false, x];
						}

						return exec(acc[1], byId[id]);
					}, [true, x]);

				if (res[0]) {
					candidate.push(res);
				}
			}

			if (candidate.length > 0) {
				if (candidate.length > 1) {
					console.log('??? where go though?', rule, candidate[1]);
				}
				return candidate[0];
			}

			return [false, x];
		};

		while (branches.length) {
			const toRun = branches.pop();
			const toRunId = `${toRun[0]}:${toRun[1].id}`;
			if (explored.has(toRunId)) {
				continue;
			}
			explored.add(toRunId);
			const res = exec(toRun[0], toRun[1]);
			if (res[0] && res[1].length === 0) {
				return res;
			}
		}
		return [false, x];
	}

	return messages.filter(x => {
		const [res, remainder] = wrappedExec(x, byId[0]);
		console.log({ res, remainder });
		return res && remainder.length === 0;
	}).length;
};

export const part2 = (input) => part1(input, true);


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	// console.time('part 2');
	console.log('Part 2', part2(input));
	// console.timeEnd('part 2');
};
// main();
