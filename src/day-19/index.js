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
			byId[8] = parseRule('8: 42 | 42 8');
		}

		if (byId[11]) {
			byId[11] = parseRule('11: 42 31 | 42 11 31');
		}
	}

	const wrappedExec = (inputStr, rule) => {
		// (str, ruleId[])[]
		const queue = [];
		const explored = new Set();
		if (rule.or) {
			rule.or.forEach(ruleIds => queue.push([inputStr, ruleIds]));
		} else {
			queue.push([inputStr, [rule.id]]);
		}

		const exec = (str, ruleIds, remainingRules = []) => {
			if (str === '' && ruleIds.length === 0) {
				return [true, ''];
			}

			const res = ruleIds.reduce(
				(acc, id, idx) => {
					if (!acc[0]) {
						return acc;
					}

					const rule = byId[id];
					if (rule.literal) {
						if (acc[1][0] === rule.literal) {
							return [true, acc[1].slice(1)];
						}

						return [false, str];
					}

					// Assume or
					const candidate = [];
					for (const subRuleIds of rule.or) {
						const orRes = exec(acc[1], subRuleIds, remainingRules.concat(ruleIds.slice(idx + 1)));
						if (orRes[0]) {
							candidate.push(orRes);
						}
					}

					// No branch works, fail
					if (candidate.length === 0) {
						return [false, str];
					}

					// Otherwise, populate queue with other branches
					while (candidate.length > 1) {
						const [_, substr] = candidate.pop();
						// Continue from this substr + the rest of the current rule if this one doesn't pan out
						queue.push([substr, remainingRules.concat(ruleIds.slice(idx + 1))]);
					}

					// And explore the left here
					return candidate[0];
				}, [true, str]);

			if (res[0]) {
				return res;
			}

			return [false, str];
		};

		while (queue.length) {
			const toRun = queue.pop();
			const toRunId = `${toRun[0]}:${toRun[1].join('.')}`;
			if (explored.has(toRunId)) {
				continue;
			}
			explored.add(toRunId);
			const res = exec(toRun[0], toRun[1]);
			if (res[0] && res[1].length === 0) {
				return res;
			}
		}

		return [false, inputStr];
	}

	return messages.filter(x => {
		const [res, remainder] = wrappedExec(x, byId[0]);
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
main();
