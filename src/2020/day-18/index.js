import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import jsep from 'jsep';

const evalNode = node => {
	if (node.type === 'BinaryExpression') {
		const left = evalNode(node.left);
		const right = evalNode(node.right);
		if (node.operator === '+') {
			return left + right;
		}
		return left * right;
	}

	if (node.type === 'Literal') return node.value;
}

export const part1 = (input) => {
	jsep.addBinaryOp('+', 10);
	jsep.addBinaryOp('*', 10);
	const res = input.split('\n').map(jsep).map(evalNode);
	return fp.sum(res);
};

export const part2 = (input) => {
	jsep.addBinaryOp('+', 10);
	jsep.addBinaryOp('*', 1);
	const res = input.split('\n').map(jsep).map(evalNode);
	return fp.sum(res);
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
