import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';
// Player 1 starting position: 8
const process = fp.flow(
	fp.split('\n'),
	x => {
		return [
			+x[0].slice(-1),
			+x[1].slice(-1),
		];
	}
);

const newDie = () => ({
	face: 0,
});

const roll = (die) => {
	die.face++;
	if (die.face > 99) {
		die.face = 0;
	}
	return die.face;
};

const newPlayer = (name) => ({
	name,
	position: 0,
	score: 0,
});

const newGame = () => ({
	a: newPlayer('a'),
	b: newPlayer('b'),
	die: newDie(),
	rolls: 0,
	universes: 1,
	turns: 0,
});

const turn = (game, player) => {
	const p1 = roll(game.die) + roll(game.die) + roll(game.die);
	player.position = (player.position + p1) % 10;
	game.rolls += 3;
	player.score += (player.position + 1);
	return player.score;
};

export const part1 = (input) => {
	const res = process(input);
	const game = newGame();
	game.a.position = res[0] - 1;
	game.b.position = res[1] - 1;
	while (true) {
		// if (game.rolls < 25) {
		// 	console.log(game);
		// }
		const aScore = turn(game, game.a);
		if (aScore >= 1000) {
			return game.b.score * game.rolls;
		}

		const bScore = turn(game, game.b);
		if (bScore >= 1000) {
			return game.b.score * game.rolls;
		}
	}
};

const advance = (player, amount) => {
	player.position = (player.position + amount) % 10;
	player.score += (player.position + 1);
};

const newGame2 = () => ({
	players: [
		newPlayer('a'),
		newPlayer('b'),
	],
	universes: 1,
	turns: 0,
});

const clone = game => ({
	players: [
		{ ...game.players[0] },
		{ ...game.players[1] },
	],
	universes: game.universes,
	turns: game.turns,
})

export const part2 = (input) => {
	const res = process(input);

	// Each roll:
	// 1, 2, 3
	// 1, 2, 3
	// 1, 2, 3
	const outcomes = {};
	for (let i = 1; i <= 3; i++) {
		for (let j = 1; j <= 3; j++) {
			for (let k = 1; k <= 3; k++) {
				const value = i + j + k;
				if (!outcomes[value]) outcomes[value] = 0;
				outcomes[value]++;
			}
		}
	}
	const paths = fp.toPairs(outcomes)
		.map(pair => {
			return {
				value: +pair[0],
				universes: +pair[1],
			};
		});

	console.log(paths);
	let playerAWins = 0;
	let playerBWins = 0;

	// Each player rolls each of the 5 outcomes on their turn
	// Each outcome splits the universe that many times
	// So multiply by outcomes after each stage
	// Search for ways to 21 using game rules and each outcome?
	// Compute all paths to 21 for either player?

	// DFS all paths
	const go = (game, roll, activeIdx, nextIdx) => {
		const active = game.players[activeIdx];

		// Run the outcomes for this single roll
		game.turns++;
		advance(active, roll.value);
		game.universes *= roll.universes;

		// If this game is over, step back
		if (active.score >= 21) {
			if (activeIdx === 0) {
				playerAWins += game.universes;
			} else {
				playerBWins += game.universes;
			}
			return;
		}

		paths.forEach(nextRoll => {
			go(clone(game), nextRoll, nextIdx, activeIdx);
		});
	};

	// Root game state
	const game = newGame2();
	game.turns = -1;
	game.players[0].position = res[0] - 1;
	game.players[1].position = res[1] - 1;

	// Start exploring each initial turn for player 1
	paths.forEach(nextRoll => {
		go(clone(game), nextRoll, 0, 1);
	});

	console.log({ game, playerAWins, playerBWins });
	return Math.max(playerAWins, playerBWins);
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
