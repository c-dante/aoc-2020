import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const digits = [
	'abcefg',
	'cf',
	'acdeg',
	'acdfg',
	'bcdf',
	'abdfg',
	'abdefg',
	'acf',
	'abcdefg',
	'abcdfg',
];
const digitMap = digits.reduce((acc, x, i) => {
	acc[x] = i;
	return acc;
}, {});

const translateRow = (patterns, outputs) => {
	const seven = patterns.find(x => x.length === 3).split('');
	const one = patterns.find(x => x.length === 2).split('');
	const four = patterns.find(x => x.length === 4).split('');
	const zeroSixNine = patterns.filter(x => x.length === 6)
		.map(x => x.split(''));
	const twoThreeFive = patterns.filter(x => x.length === 5)
		.map(x => x.split(''));

	// a => 7 - 1
	const a = seven.find(x => !one.includes(x));

	// bd = 4 - 7 - a
	// const bd = four.filter(x => !seven.includes(x) || x === a);

	// g = (069) - 4 - a
	const nine = zeroSixNine.find(
		x => x.filter(
			z => !four.includes(z) && z !== a
		).length === 1);
	const g = nine.filter(z => !four.includes(z) && z !== a)[0];

	const zeroSix = zeroSixNine.filter(
		x => x.join('') !== nine.join('')
	);
	const e = zeroSix[0].filter(x => !nine.includes(x))[0];
	const zero = zeroSix.find(
		x => x.includes(one[0]) && x.includes(one[1])
	);
	const six = zeroSix.filter(x => x !== zero)[0];

	const d = six.filter(
		x => !zero.includes(x)
	)[0];

	const b = four.filter(
		x => !one.includes(x) && x !== d
	)[0];

	const c = zero.filter(
		x => !six.includes(x)
	)[0];

	const f = digits[8].split('').filter(
		x => x !== a
			&& x !== b
			&& x !== c
			&& x !== d
			&& x !== e
			&& x !== g
	)[0];

	const lookup = fp.invert({ a, b, c, d, e, f, g });

	return +outputs.map(
		letters => {
			const word = letters.split('')
				.map(src => lookup[src]);
			word.sort();
			return digitMap[word.join('')];
		}
	).join('');
};

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => {
		const [l, r] = x.split(' | ');
		const patterns = l.split(' ');
		const outputs = r.split(' ');
		return {
			patterns,
			outputs,
		};
	}),
);

export const part1 = (input) => {
	const res = process(input)
		// .slice(0, 1)
		.reduce((acc, x) => {
			// console.log(x, translateRow(x.patterns));
			return acc += x.outputs.filter(v =>
				v.length === 2
				|| v.length === 3
				|| v.length === 4
				|| v.length === 7).length;
		}, 0);
	return res;
};

export const part2 = (input) => {
	const res = process(input)
		// .slice(1, 2)
		.reduce((acc, x) => {
			return acc + translateRow(x.patterns, x.outputs);
		}, 0);
	return res;
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
