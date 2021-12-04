import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const process = fp.flow(
	fp.split('\n\n'),
	x => {
		const [rawCalls, ...rawBoards] = x;
		const boards = rawBoards.map(
			board => util.parseGrid(board, x => Number(x))
		);
		const calls = rawCalls.split(',').map(x => Number(x));
		return { calls, boards };
	},
);

const callNumber = (board, num) => {
	if (board.indexed[num]) {
		board.called.push(num);
	}
	return board;
};

const isWinner = (board) => {
	const res = board.called.reduce((acc, num) => {
		const call = board.indexed[num];
		acc.rows[call.x] += 1;
		acc.cols[call.y] += 1;
		if (call.x === call.y) {
			acc.diags[0] += 1;
		}

		if (4 - call.x === call.y) {
			acc.diags[1] += 1;
		}

		return acc;
	}, {
		rows: [0, 0, 0, 0, 0],
		cols: [0, 0, 0, 0, 0],
		diags: [0, 0],
	});

	return res.rows.some(x => x === 5)
		|| res.cols.some(x => x === 5)
	// || res.diags[0] === 5
	// || res.diags[1] === 5;
}

export const part1 = (input) => {
	const res = process(input);
	// find first winning board
	let found;
	let lastCall = 0;

	const boards = res.boards.map(board => ({
		...board,
		called: [],
	}));

	// Call off
	res.calls.forEach(call => {
		if (found) return;

		lastCall = call;
		boards.forEach((board, i) => {
			// call for board
			callNumber(board, call);

			// if
			if (isWinner(board)) {
				found = board;
			}
		});
	});

	const calledSet = new Set(found.called);
	const sum = Object.keys(found.indexed).reduce((acc, key) => {
		const keyNum = +key;
		if (!calledSet.has(keyNum)) {
			return acc += keyNum;
		}
		return acc;
	}, 0);
	return sum * lastCall;
};

export const part2 = (input) => {
	const res = process(input);
	// find first winning board

	const boards = res.boards.map(board => ({
		...board,
		called: [],
	}));

	// Call off
	let found;
	let lastWinCall;
	const winBoards = new Set();
	res.calls.forEach(call => {
		boards.forEach((board, i) => {
			if (winBoards.has(i)) {
				return;
			}

			// call for board
			callNumber(board, call);

			// if
			if (isWinner(board)) {
				winBoards.add(i);
				found = board;
				lastWinCall = call;
			}
		});
	});

	const calledSet = new Set(found.called);
	const sum = Object.keys(found.indexed).reduce((acc, key) => {
		const keyNum = +key;
		if (!calledSet.has(keyNum)) {
			return acc += keyNum;
		}
		return acc;
	}, 0);
	return sum * lastWinCall;
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
