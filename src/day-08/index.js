import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input) => {
	const pgrm = input.split('\n').map((x, i) => {
		const [cmd, arg] = x.split(' ');
		return { id: i, cmd, arg: +arg };
	});

	const visited = new Set();
	let acc = 0;
	let pc = 0;
	while (true) {
		if (visited.has(pc)) {
			return acc;
		}
		visited.add(pc);
		const { cmd, arg } = pgrm[pc];
		if (cmd === 'nop') {
			pc++;
		} else if (cmd == 'jmp') {
			pc += arg;
		} else if (cmd === 'acc') {
			acc += arg;
			pc++;
		}
	}
};

const runPart2 = (pgrm) => {
	const visited = new Set();
	let acc = 0;
	let pc = 0;
	const stack = [];
	while (true) {
		if (visited.has(pc)) {
			return { valid: false, acc, stack };
		}

		if (pc === pgrm.length) {
			return { valid: true, acc, stack };
		}
		visited.add(pc);
		const { cmd, arg } = pgrm[pc];
		if (cmd === 'nop') {
			stack.push(pc);
			pc++;
		} else if (cmd == 'jmp') {
			stack.push(pc);
			pc += arg;
		} else if (cmd === 'acc') {
			acc += arg;
			pc++;
		}
	}
}

export const part2 = (input) => {
	const pgrm = input.split('\n').map((x, i) => {
		const [cmd, arg] = x.split(' ');
		return { id: i, cmd, arg: +arg };
	});

	let { valid, acc, stack } = runPart2(pgrm);
	let replace = 0;
	while (!valid) {
		const toReplace = stack[replace];
		const newPgrm = pgrm.slice();
		newPgrm[toReplace] = {
			...newPgrm[toReplace],
			cmd: newPgrm[toReplace].cmd === 'jmp' ? 'nop' : 'jmp'
		};
		const out = runPart2(newPgrm);
		valid = out.valid;
		acc = out.acc;
		replace++;
	}
	return acc;
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
