import fs from 'fs';
import fp from 'lodash/fp.js';

const rx = /(\d+)-(\d+) (\w): (\w+)/
const process = fp.flow(
	fp.split('\n'),
	fp.map(x => {
		const [_, from, to, letter, password] = rx.exec(x);
		return { from, to, letter, password };
	}),
);


export const part1 = fp.flow(
	process,
	fp.sumBy(({ from, to, letter, password }) => {
		const s = password.split('').filter(x => x === letter).length;
		return Number(s >= from && s <= to);
	}),
);

export const part2 = fp.flow(
	process,
	fp.sumBy(({ from, to, letter, password }) => {
		const out = Number(password[from - 1] === letter) + Number(password[to - 1] === letter);
		return Number(out === 1);
	}),
);

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
