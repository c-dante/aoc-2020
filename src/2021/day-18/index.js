import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';
import jsep from 'jsep';

let id = 0;
const newNode = ({ ...props }) => {
	id++;
	return { id, ...props };
};
const process = input => fp.flow(
	fp.split('\n'),
	fp.map(jsep),
	x => {
		const byId = {};
		const snails = x.map(expr => {
			const go = (node, parent = undefined, depth = 0) => {
				if (node.type === 'Literal') {
					return newNode({ parent, value: node.value, depth });
				}

				if (node.type === 'ArrayExpression') {
					const res = newNode({ parent, depth });
					res.l = go(node.elements[0], res.id, depth + 1);
					res.r = go(node.elements[1], res.id, depth + 1);
					byId[res.l.id] = res.l;
					byId[res.r.id] = res.r;
					byId[res.id] = res;
					return res;
				}
			};
			return go(expr);
		});

		return {
			byId,
			snails,
		};
	}
)(input);

const print = tree => {
	const go = (node, res = []) => {
		if (node.value !== undefined) {
			return res.concat(node.value);
		}
		const l = go(node.l);
		const r = go(node.r);
		return res.concat('[', l, ',', r, ']');
	}
	return go(tree).join('');
}

const reduce = (byId, snail) => {
	const doAdd = (node, value) => {
		node.value += value;
		// if (node.value >= 10) {
		// 	console.log('Trigger Split => ', node, print(snail));
		// 	return doSplit(node);
		// }
	}

	const addRight = (node, prevId, value, ascend = true) => {
		// if ascending
		if (ascend) {
			// and came from the left, go right
			if (node.l.id === prevId) {
				// If it's a value, add
				if (node.r.value !== undefined) {
					return doAdd(node.r, value);
				}

				// Otherwise, switch to descent and recurse
				return addRight(node.r, node.id, value, false);
			}

			// and came from the right, go up if possible
			if (node.r.id === prevId) {
				// Nothing to do, at the top and can't go right
				if (node.parent === undefined) return;

				// Go up again
				return addRight(byId[node.parent], node.id, value, ascend);
			}

			throw new Error('wat');
		}

		// Otherwise, if we're descending, go left until a leaf
		if (node.value !== undefined) {
			throw new Error('wat')
		}

		// If the left is a leaf, add
		if (node.l.value !== undefined) {
			return doAdd(node.l, value);
		}

		// Otherwise, keep descending
		return addRight(node.l, node.id, value, ascend);
	}


	const addLeft = (node, prevId, value, ascend = true) => {
		// if ascending
		if (ascend) {
			// and came from the right, go left
			if (node.r.id === prevId) {
				// If it's a value, add
				if (node.l.value !== undefined) {
					return doAdd(node.l, value);
				}

				// Otherwise, switch to descent and recurse
				return addLeft(node.l, node.id, value, false);
			}

			// and came from the left, go up if possible
			if (node.l.id === prevId) {
				// Nothing to do, at the top and can't go left
				if (node.parent === undefined) return;

				// Go up again
				return addLeft(byId[node.parent], node.id, value, ascend);
			}

			throw new Error('wat');
		}

		// Otherwise, if we're descending, go right until a leaf
		if (node.value !== undefined) {
			throw new Error('wat')
		}

		// If the right is a leaf, add
		if (node.r.value !== undefined) {
			return doAdd(node.r, value);
		}

		// Otherwise, keep descending
		return addLeft(node.r, node.id, value, ascend);
	}

	const explode = (node) => {
		if (node.l.value === undefined || node.r.value === undefined) return false;
		// console.log('E', [node.l.value, node.r.value]);
		const parent = byId[node.parent];
		const leftVal = node.l.value
		const rightVal = node.r.value
		delete byId[node.l.id];
		delete byId[node.r.id];
		delete node.l;
		delete node.r;
		node.value = 0;
		if (parent.l === node) {
			parent.l = node;
			addLeft(parent, node.id, leftVal);
			addRight(parent, node.id, rightVal);
		} else {
			parent.r = node;
			addLeft(parent, node.id, leftVal);
			addRight(parent, node.id, rightVal);
		}

		// console.log('E =>', print(snail))
		return true;
	}

	const doSplit = (node) => {
		// console.log('S', node.value);

		node.l = newNode({
			parent: node.id,
			value: Math.floor(node.value / 2),
			depth: node.depth + 1,
		});
		byId[node.l.id] = node.l;

		node.r = newNode({
			parent: node.id,
			value: Math.ceil(node.value / 2),
			depth: node.depth + 1,
		});
		byId[node.r.id] = node.r;

		node.value = undefined;

		// console.log('S ==>', print(snail))
		// if (node.depth >= 4) {
		// 	return explode(node);
		// }
		return true;
	}

	let shouldSplit = true;
	const goExp = (node, depth = 0) => {
		if (node.value === undefined && depth >= 4) {
			if (explode(node)) {
				shouldSplit = true;
			}
		}

		if (node.value !== undefined) {
			return;
		}

		goExp(node.l, depth + 1);
		goExp(node.r, depth + 1);
	};

	const goSplit = (node) => {
		// Leaf
		if (node.value !== undefined) {
			if (node.value >= 10) {
				doSplit(node);
				return true;
			}
			return false;
		}

		if (goSplit(node.l)) return true;
		if (goSplit(node.r)) return true;
		return false;
	}

	// Keep reducing until no action
	while (shouldSplit) {
		// handle explosions
		goExp(snail);

		if (shouldSplit) {
			shouldSplit = goSplit(snail);
		}
	}

	return snail;
}

const magnitude = (snail) => {
	const go = (node) => {
		if (node.value !== undefined) {
			return node.value;
		}
		return go(node.l) * 3 + go(node.r) * 2;
	}
	return go(snail);
}

const shiftSnail = (snail) => {
	const go = (node) => {
		node.depth++;
		if (node.value === undefined) {
			go(node.l);
			go(node.r);
		}
	};
	go(snail);
}

export const part1 = (input) => {
	const { byId, snails } = process(input)
	const res = snails.reduce((acc, snail) => {
		// const reduceSnail = reduce(byId, snail);
		// console.log('REDUCE ACC', print(reduce(byId, acc)));
		// console.log('REDUCE SNAIL', print(reduceSnail));
		const addRes = newNode({
			parent: undefined,
			l: acc,
			r: snail,
			depth: -1,
		});
		acc.parent = addRes.id;
		snail.parent = addRes.id;
		byId[addRes.id] = addRes;
		shiftSnail(addRes);
		// console.log('ADD', print(addRes));
		return reduce(byId, addRes)
	});
	return { mag: magnitude(res), res };
}

export const part2 = (input) => {
	const rows = input.split('\n');
	const pairs = rows.flatMap((row) => rows.map((_, i) => [row, rows[i]]))
		.filter((pair) => pair[0] !== pair[1])
		.map(pair => part1(pair.join('\n')));
	const max = fp.maxBy(pair => pair.mag, pairs);
	console.log(max);
	return max.mag;
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
