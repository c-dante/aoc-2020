import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const score = fp.flow(
	fp.reverse,
	x => x.map((n, i) => n * (i + 1)),
	fp.sum
);

export const part1 = (input) => {
	const parsed = util.emptyLineGroupedReduce(input);
	const p1 = parsed[0].slice(1).map(Number);
	const p2 = parsed[1].slice(1).map(Number);
	const playRound = () => {
		const a = p1.shift();
		const b = p2.shift();
		if (a > b) {
			p1.push(a, b);
		} else {
			p2.push(b, a);
		}
	}

	while (p1.length && p2.length) {
		playRound();
	}

	if (p1.length) {
		return score(p1);
	}

	return score(p2);
};


const P1_WIN = 'p1';
const P2_WIN = 'p2';
export const part2 = (input) => {
	const parsed = util.emptyLineGroupedReduce(input);
	const p1 = parsed[0].slice(1).map(Number);
	const p2 = parsed[1].slice(1).map(Number);

	const deckIds = (p1, p2) => [p1.join(','), p2.join(',')].join('|');

	const playGame = (p1, p2) => {
		const roundSet = new Set();

		while (p1.length && p2.length) {
			const id = deckIds(p1, p2);
			if (roundSet.has(id)) {
				return P1_WIN;
			}
			roundSet.add(id);

			const a = p1.shift();
			const b = p2.shift();
			if (a <= p1.length && b <= p2.length) {
				const winner = playGame(
					p1.slice(0, a),
					p2.slice(0, b)
				);
				if (winner === P1_WIN) {
					p1.push(a, b);
				} else {
					p2.push(b, a);
				}
			} else {
				if (a > b) {
					p1.push(a, b);
				} else {
					p2.push(b, a);
				}
			}
		}

		if (p1.length === 0) {
			return P2_WIN;
		}

		return P1_WIN;
	}
	const res = playGame(p1, p2);
	if (res === P1_WIN) {
		return score(p1);
	}
	return score(p2);
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.time('part 1');
	console.log('Part 1', part1(input));
	console.timeEnd('part 1');
	console.time('part 2');
	console.log('Part 2', part2(input));
	console.timeEnd('part 2');
};
main();
