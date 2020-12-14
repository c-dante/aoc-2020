import fs from 'fs';
import fp from 'lodash/fp.js';
import BitSet from 'bitset';
import { CartesianProduct } from 'js-combinatorics';

export const part1 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {
		const [l, op, r] = x.split(' ');
		const [_, name, __, idx] = /(\w+)(\[(\w+)\])?/.exec(l);
		if (name === 'mask') {
			acc.mask = [];
			r.split('')
				.forEach((x, i) => {
					if (x === '1') {
						acc.mask.push([35 - i, 1]);
					} else if (x === '0') {
						acc.mask.push([35 - i, 0]);
					}
				});
		} else {
			const val = new BitSet(+r);
			acc.mask.forEach(([bit, state]) => val.set(bit, state));
			acc.mem[+idx] = +val.toString(10);
		}
		return acc;
	}, {
		mem: [],
		mask: [],
	});

	return fp.sum(res.mem);
};


export const part2 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {
		const [l, op, r] = x.split(' ');
		const [_, name, __, idx] = /(\w+)(\[(\w+)\])?/.exec(l);
		if (name === 'mask') {
			acc.base = [];
			const floating = [];
			r.split('')
				.forEach((x, i) => {
					if (x === '1') {
						acc.base.push(35 - i);
					} else if (x === 'X') {
						floating.push([
							[35 - i, 0],
							[35 - i, 1],
						]);
					}
				});
				acc.set = new CartesianProduct(...floating);
		} else {
			const mem = new BitSet(+idx);
			acc.base.forEach((bit) => {
				mem.set(bit, 1);
			});
			for (const perm of acc.set) {
				const newBase = mem.clone();
				perm.forEach(([bit, state]) => newBase.set(bit, state));
				acc.mem[+newBase.toString(10)] = +r;
			}
		}
		return acc;
	}, {
		mem: [],
		base: [],
		set: undefined
	});

	return fp.sum(res.mem);
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	console.time('part 2');
	console.log('Part 2', part2(input));
	console.timeEnd('part 2');
};
main();
