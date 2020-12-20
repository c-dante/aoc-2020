import fs, { Dir } from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

const DIRS = [
	'top',
	'left',
	'bottom',
	'right',
];

const getBorders = tile => {
	const top = tile[0];
	const bottom = fp.last(tile);
	const left = tile.map(fp.first).join('');
	const right = tile.map(fp.last).join('');

	return { top, bottom, left, right, xform: [] };
};

const flipY = tile => ({
	id: tile.id,
	top: fp.reverse(tile.top).join(''),
	bottom: fp.reverse(tile.bottom).join(''),
	left: tile.right,
	right: tile.left,
	xform: tile.xform.concat('flipY'),
});
const flipX = tile => ({
	id: tile.id,
	top: tile.bottom,
	bottom: tile.top,
	left: fp.reverse(tile.left).join(''),
	right: fp.reverse(tile.right).join(''),
	xform: tile.xform.concat('flipX'),
});
const rotate_cw = tile => ({
	id: tile.id,
	top: fp.reverse(tile.left).join(''),
	bottom: fp.reverse(tile.right).join(''),
	left: tile.bottom,
	right: tile.top,
	xform: tile.xform.concat('rotate_cw'),
});


const applyXform = (xforms, tile) => xforms.reduce((acc, xform) => xform(acc), tile);
const check = [
	[x => x],
	[rotate_cw],
	[rotate_cw, rotate_cw],
	[rotate_cw, rotate_cw, rotate_cw],
	[flipX],
	[flipX, rotate_cw],
	[flipX, rotate_cw, rotate_cw],
	[flipX, rotate_cw, rotate_cw, rotate_cw],
	[flipY],
	[flipY, rotate_cw],
	[flipY, rotate_cw, rotate_cw],
	[flipY, rotate_cw, rotate_cw, rotate_cw],
	[flipX, flipY],
	[flipX, flipY, rotate_cw],
	[flipX, flipY, rotate_cw, rotate_cw],
	[flipX, flipY, rotate_cw, rotate_cw, rotate_cw],
].filter((x, i, collection) => {
	// Dedupe transformations preferring simpler ones
	const tile = getBorders(['123', '456', '789']);
	const base = applyXform(x, tile);
	for (const j in collection) {
		if (i > +j) {
			const other = applyXform(collection[j], tile);
			if (
				base.top === other.top
				&& base.left === other.left
				&& base.bottom === other.bottom
				&& base.right === other.right
			) {
				return false;
			}
		}
	}
	return true;
});

const printTile = tile => {
	const length = tile.top.length;
	return [
		tile.top,
		...tile.left
			.split('')
			.slice(1, -1)
			.map((x, i) => {
				const out = '-'.repeat(length - 2);
				return `${tile.left[i + 1]}${out}${tile.right[i + 1]}`;
			}),
		tile.bottom
	].join('\n');
}

const checkFit = (grid, x, y, tile) => {
	const topTile = grid[x]?.[y-1];
	if (topTile && topTile.bottom !== tile.top) {
		return false;
	}

	const rightTile = grid[x + 1]?.[y];
	if (rightTile && rightTile.left !== tile.right) {
		return false;
	}

	const bottomTile = grid[x]?.[y + 1];
	if (bottomTile && bottomTile.top !== tile.bottom) {
		return false;
	}

	const leftTile = grid[x - 1]?.[y];
	if (leftTile && leftTile.right !== tile.left) {
		return false;
	}

	return true;
}

const getCandidates = (grid, x, y, pool) => pool.reduce((acc, tile) => {
	check.forEach(xforms => {
		const candidate = applyXform(xforms, tile);
		if (checkFit(grid, x, y, candidate)) {
			acc.push({ ...candidate, id: tile.id });
		}
	})
	return acc;
}, []);

// R1, R2 = reverse
// R3, R4 = "normal"

// Under rotation:
// 90 =>

const isValid = (arrangement) => {
	return arrangement.every(
		x => x.every(
			cell => cell !== undefined
		)
	);
}

const getCoords = length => {
	const coords = [];
	for (let y = 0; y < length; y++) {
		for (let x = 0; x < length; x++) {
			if (x === 0 && y === 0) continue;
			coords.push([x, y]);
		}
	}
	return coords;
}

const getCorners = (grid, length) => [
	grid[0][0],
	grid[0][length - 1],
	grid[length - 1][0],
	grid[length - 1][length - 1],
];

const buildGrid = (tiles) => {
	// square arrangement, so sqrt for edge size?
	const length = Math.sqrt(tiles.length);

	const byId = fp.keyBy('id', tiles);

	// Start with top left (?)
	const topLeftPool = tiles.slice();

	const solveGrid = (grid, coords, idBag) => {
		if (coords.length === 0) return grid;

		const [x, y] = coords.shift();

		// Try each tile
		const snapIds = [...idBag];
		for (const candidateId of snapIds) {
			const candidate = byId[candidateId];
			for (const xform of check) {
				const xformCandidate = applyXform(xform, candidate);
				// This tile fits in this orientation, so try it
				if (checkFit(grid, x, y, xformCandidate)) {
					grid[x][y] = xformCandidate;
					idBag.delete(candidateId)
					const solved = solveGrid(grid, coords, idBag);
					// If that solved the grid, we're done
					if (solved) {
						return solved;
					}

					// Otherwise, backtrack
					grid[x][y] = undefined;
					idBag.add(candidateId);
				}
			}
		}

		return grid;
	};

	while (topLeftPool.length) {
		const topLeft = topLeftPool.pop();
		const idBag = new Set(tiles.map(x => x.id));
		idBag.delete(topLeft.id);

		for (const xform of [x => x, flipX, flipY]) {
			const grid = util.get2dGrid(length);
			grid[0][0] = xform(topLeft);

			const res = solveGrid(grid, getCoords(length), idBag);
			if (res && isValid(res)) {
				return res;
			}
		}
	}

	return undefined;
}

export const part1 = (input) => {
	const rx = /Tile (\d+):/;
	const tiles = util.emptyLineGroupedReduce(input).map(
		tile => {
			const id = rx.exec(tile.shift())[1]
			return ({
				id: +id,
				...getBorders(tile),
			});
		}
	);

	const grid = buildGrid(tiles);
	if (!grid) {
		return 0;
	}

	// square arrangement, so sqrt for edge size?
	const length = Math.sqrt(tiles.length);
	return getCorners(grid, length)
		.map(x => x.id)
		.reduce((a, b) => a * b, 1);
};

export const part2 = (input) => {
	const res = input.split('\n').reduce((acc, x) => {

	}, {});
	return res;
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
