import fs from 'fs';
import fp from 'lodash/fp.js';
import { CartesianProduct } from 'js-combinatorics';

const ZERO = BigInt(0);
const ONE = BigInt(1);
const MAX = BigInt("0b111111111111111111111111111111111111");

export const part1 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {
		const [l, op, r] = x.split(' ');
		const [_, name, __, idx] = /(\w+)(\[(\w+)\])?/.exec(l);
		if (name === 'mask') {
			acc.maskOn = ZERO;
			acc.maskOff = MAX;
			r.split('')
				.forEach((x, i) => {
					if (x === '1') {
						acc.maskOn |= ONE << BigInt(35 - i);
					} else if (x === '0') {
						acc.maskOff ^= ONE << BigInt(35 - i);
					}
				});
		} else {
			const val = ((BigInt(+r) | acc.maskOn) & acc.maskOff);
			acc.mem.set(+idx, Number(val));
		}
		return acc;
	}, {
		mem: new Map(),
		maskOn: ZERO,
		maskOff: MAX,
	});

	return fp.sum([...res.mem.values()]);
};


export const part2 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {
		const [l, op, r] = x.split(' ');
		const [_, name, __, idx] = /(\w+)(\[(\w+)\])?/.exec(l);
		if (name === 'mask') {
			acc.baseOn = ZERO;
			const floating = [];
			r.split('')
				.forEach((x, i) => {
					if (x === '1') {
						acc.baseOn |= ONE << BigInt(35 - i);
					} else if (x === 'X') {
						floating.push([
							[BigInt(35 - i), ZERO],
							[BigInt(35 - i), ONE],
						]);
					}
				});
				acc.set = new CartesianProduct(...floating);
		} else {
			const withOn = BigInt(+idx) | acc.baseOn;

			for (const perm of acc.set) {
				const newBase = perm.reduce((acc, [bit, state]) => {
					if (state) {
						return acc |= ONE << bit;
					}

					return acc &= MAX ^ (ONE << bit);
				}, withOn);
				acc.mem.set(Number(newBase), +r);
			}
		}
		return acc;
	}, {
		mem: new Map(),
		baseOn: ZERO,
		set: undefined
	});

	return fp.sum([...res.mem.values()]);
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
