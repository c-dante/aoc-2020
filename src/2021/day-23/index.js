import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';

const mult = {
	A: 1,
	B: 10,
	C: 100,
	D: 1000,
};

const dest = {
	A: 2,
	B: 4,
	C: 6,
	D: 8,
};

const key = ({ x, y }) => `${x},${y}`;

const process = fp.flow(
	fp.split('\n'),
	lines => {
		const [wall, shift, ...stuck] = lines;
		stuck.pop(); // drop wall

		const map = {};
		const nonEntrance = new Set();
		shift.slice(1, -1).split('').forEach((ignore, x) => {
			nonEntrance.add(x);
			map[key({ x, y: 0 })] = '.';
		});

		let playerId = 0;
		const players = {};
		stuck.forEach((row, y) => {
			row.split('').map((item, x) => {
				if (mult[item]) {
					const pt = { x: x - 1, y: y + 1 };
					nonEntrance.delete(x - 1);
					map[key(pt)] = item;
					players[playerId] = {
						id: playerId,
						item,
						pt,
					};
					playerId++;
				}
			})
		});

		return {
			map,
			players,
			nonEntrance,
		};
	}
);

const moveYTo = (map, player, targetY) => {
	// Move up
	const dir = player.pt.y > targetY ? -1 : 1;
	const x = player.pt.x;

	let y = player.pt.y;
	let dist = 0;
	while (y !== targetY) {
		y += dir;
		dist++;
		if (map[key({ x, y })] !== '.') {
			return false;
		}
	}

	return {
		pt: { x, y },
		cost: dist * mult[player.item],
	};
}

const moveXTo = (map, player, targetX) => {
	let dir = player.pt.x > targetX ? -1 : 1;
	const y = player.pt.y;

	let x = player.pt.x;
	let dist = 0;
	while (x !== targetX) {
		x += dir;
		dist++;
		if (map[key({ x, y })] !== '.') {
			return false;
		}
	}

	return {
		pt: { x, y },
		cost: dist * mult[player.item],
	};
}

const canMoveHome = (map, player, maxY = 2) => {
	const moveX = moveXTo(map, player, dest[player.item]);
	if (!moveX) return false;

	// Go deep
	let depth = maxY;
	for (let y = maxY; y > 0; y--) {
		const deep = map[key({ x: dest[player.item], y })];
		if (deep === '.') {
			return {
				pt: { x: dest[player.item], y },
				cost: moveX.cost + depth * mult[player.item],
			};
		}

		// Someone needs to move
		if (deep !== player.item) {
			return false;
		}

		// One less depth
		depth--;
	}

	// Oh no?
	return false;
}

const movePlayer = (map, players, cost, nonEntrance, player, result) => {
	const newMap = { ...map };
	newMap[key(player.pt)] = '.';
	newMap[key(result.pt)] = player.item;

	const newPlayers = {
		...players,
		[player.id]: {
			...player,
			pt: result.pt,
		},
	};

	return {
		map: newMap,
		players: newPlayers,
		cost: cost + result.cost,
		nonEntrance,
	};
};

const validMoves = ({ map, players, cost, nonEntrance }, maxY = 2) => Object.keys(players).reduce((acc, playerId) => {
	const player = players[playerId];
	// If in the right room and below me is correct, done
	if (
		player.pt.x === dest[player.item]
		&& player.pt.y > 0
		&& map[key({ x: player.pt.x, y: 2 })] === player.item) {
		return acc;
	}

	// If in the hall, only other move is into its room as deep as possible
	if (player.pt.y === 0) {
		const res = canMoveHome(map, player, maxY);
		if (res !== false) {
			acc.push(movePlayer(map, players, cost, nonEntrance, player, res));
		}
	}

	// If not in the hall, and no one above me, go to anywhere in the hall not in front of a door
	if (player.pt.y !== 0) {
		// First move outside
		const yMove = moveYTo(map, player, 0);
		if (yMove !== false) {
			const fakePlayer = {
				...player,
				pt: yMove.pt,
			};

			// Now try to move to each non-entrance
			nonEntrance.forEach(x => {
				const xMove = moveXTo(map, fakePlayer, x);
				if (xMove !== false) {
					const res = {
						pt: xMove.pt,
						cost: yMove.cost + xMove.cost,
					};
					acc.push(movePlayer(map, players, cost, nonEntrance, player, res));
				}
			})
		}
	}

	return acc;
}, []);

const printMap = map => {
	const out = Object.keys(map).reduce((acc, key) => {
		const [x, y] = key.split(',').map(x => Number(x));
		if (y === 0) {
			acc.top[x] = map[key];
		} else if (y === 1) {
			acc.mid[x] = map[key];
		} else if (y === 2) {
			acc.bot[x] = map[key];
		}
		return acc;
	}, {
		top: new Array(10).fill('.'),
		mid: new Array(10).fill(' '),
		bot: new Array(10).fill(' '),
	})
	console.log(out.top.join(''));
	console.log(out.mid.join(''));
	console.log(out.bot.join(''));
	console.log('');
};

const mapToKey = fp.flow(
	fp.toPairs,
	fp.sortBy(x => x[0]),
	fp.map(fp.join(':')),
	fp.join('|')
);

const isSolved = ({ players }) => Object.values(players)
	.every(p => p.pt.y > 0 && p.pt.x === dest[p.item]);

const solve = (input, maxY = 2) => {
	const res = process(input);
	const heap = new Heap((a, b) => a.cost - b.cost);

	// Initial path
	const start = {
		...res,
		cost: 0
	};

	// Push all valid moves onto the heap
	validMoves(start, maxY).forEach(move => heap.push(move));

	// While not solved, pop + push all next moves
	const solutions = [];
	const visited = new Set();
	while (!heap.empty()) {
		const active = heap.pop();
		if (isSolved(active)) {
			solutions.push(active);
			break;
		} else {
			const key = mapToKey(active.map);
			if (visited.has(key)) continue;
			visited.add(key);
			validMoves(active, maxY).forEach(move => heap.push(move));
		}
	}
	console.log(solutions.length);

	return fp.minBy(x => x.cost, solutions).cost;
}

export const part1 = (input) => solve(input, 2);

export const part2 = (input) => solve(input, 4);


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.time('part 1');
	console.log('Part 1', part1(input));
	console.timeEnd('part 1');
	console.time('part 2');
	const aug = input.split('\n')
	aug.splice(3, 0,
		'  #D#C#B#A#  ',
		'  #D#B#A#C#  ',
	);
	console.log('Part 2', part2(aug.join('\n')));
	console.timeEnd('part 2');
};
main();
