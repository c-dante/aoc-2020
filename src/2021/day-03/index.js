import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('').map(x => +x)),
	fp.reduce((acc, x) => {
		x.forEach((z, i) => {
			if (!acc[i]) {
				acc[i] = [0, 0];
			}
			acc[i][0] += z === 0 ? 1 : 0;
			acc[i][1] += z === 1 ? 1 : 0;
		});
		return acc;
	}, []),
	x => {
		return [
			x.map(z => z[0] > z[1] ? 0 : 1),
			x.map(z => z[0] > z[1] ? 1 : 0),
		]
	},
);

export const part1 = (input) => {
	const res = process(input)
	return parseInt(res[0].join(''), 2) * parseInt(res[1].join(''), 2);
};

const process2 = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('').map(x => +x)),
	data => {
		let idx = 0;
		let most = data.slice();
		while (most.length > 1) {
			const bits = most.reduce((acc, x) => {
				acc[0] += x[idx] === 0 ? 1 : 0;
				acc[1] += x[idx] === 1 ? 1 : 0;
				return acc;
			}, [0, 0]);
			const bit = bits[0] > bits[1] ? 0 : 1;
			most = most.filter(x => x[idx] === bit);
			idx++;
		}
		const a = parseInt(most[0].join(''), 2);

		idx = 0;
		let least = data.slice();
		while (least.length > 1) {
			const bits = least.reduce((acc, x) => {
				acc[0] += x[idx] === 0 ? 1 : 0;
				acc[1] += x[idx] === 1 ? 1 : 0;
				return acc;
			}, [0, 0]);
			const bit = bits[0] > bits[1] ? 1 : 0;
			least = least.filter(x => x[idx] === bit);
			idx++;
		}
		const b = parseInt(least[0].join(''), 2);
		return a * b;
	}
);

export const part2 = (input) => {
	const res = process2(input)
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