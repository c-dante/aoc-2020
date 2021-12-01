import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const SEAT = 'L';
const FLOOR = '.';
const OCCUPIED = '#';

const apply = grid => {
	let change = false;
	const newGrid = grid.map(
		(row, y) => row.map(
			(cell, x) => {
				if (cell === SEAT &&
					// Cardinal
					grid[y][x - 1] !== OCCUPIED &&
					grid[y][x + 1] !== OCCUPIED &&
					grid[y - 1]?.[x] !== OCCUPIED &&
					grid[y + 1]?.[x] !== OCCUPIED &&
					// Diagonal
					grid[y - 1]?.[x - 1] !== OCCUPIED &&
					grid[y - 1]?.[x + 1] !== OCCUPIED &&
					grid[y + 1]?.[x + 1] !== OCCUPIED &&
					grid[y + 1]?.[x - 1] !== OCCUPIED
				) {
					change = true;
					return OCCUPIED;
				}

				if (cell === OCCUPIED) {
					// Cardinal
					const sum = Number(grid[y][x - 1] === OCCUPIED) +
						Number(grid[y][x + 1] === OCCUPIED) +
						Number(grid[y - 1]?.[x] === OCCUPIED) +
						Number(grid[y + 1]?.[x] === OCCUPIED) +
						// Diagonal
						Number(grid[y - 1]?.[x - 1] === OCCUPIED) +
						Number(grid[y - 1]?.[x + 1] === OCCUPIED) +
						Number(grid[y + 1]?.[x + 1] === OCCUPIED) +
						Number(grid[y + 1]?.[x - 1] === OCCUPIED);
					if (sum >= 4) {
						change = true;
						return SEAT;
					}
				}

				return cell;
			}
		)
	);

	return { change, newGrid };
}

export const part1 = (input) => {
	const res = input.split('\n').map(x => x.split(''));
	let iterations = 1;
	let grid = res;
	let out = apply(grid);
	while (out.change) {
		// console.log(grid.map(x => x.join('')).join('\n'));
		// console.log('-------')
		iterations++;
		grid = out.newGrid;
		out = apply(grid);
		// console.log(out.change, grid.map(x => x.join('')).join('\n'));
	}
	// console.log(grid.map(x => x.join('')).join('\n'));
	return fp.sum(
		grid.map(row => fp.sum(row.map(cell => Number(cell === OCCUPIED))))
	);
};

const apply2 = (grid, vision) => {
	let change = false;
	const newGrid = grid.map(
		(row, y) => row.map(
			(cell, x) => {
				if (cell === OCCUPIED) {
					const see = vision[`${y}.${x}`];
					if (!see) {
						throw new Error('???');
					}
					if (fp.sum(see.map(([r, c]) => Number(grid[r]?.[c] === OCCUPIED))) >= 5) {
						change = true;
						return SEAT;
					}
				}

				if (cell === SEAT) {
					const see = vision[`${y}.${x}`];
					if (!see) {
						throw new Error('???');
					}
					if (fp.sum(see.map(([r, c]) => Number(grid[r]?.[c] === OCCUPIED))) === 0) {
						change = true;
						return OCCUPIED;
					}
				}

				return cell;
			}
		)
	);

	return { change, newGrid };
}

export const part2 = (input) => {
	const res = input.split('\n').map(x => x.split(''));
	// Compute vision
	const vision = {};
	res.forEach((row, y) => row.forEach((cell, x) => {
		if (cell === SEAT || cell === OCCUPIED) {
			util.rose.forEach(([dx, dy]) => {
				const ray = util.castRay(res, (x) => x === FLOOR, y, x, dy, dx);
				if (ray !== undefined) {
					if (!vision[`${y}.${x}`]) {
						vision[`${y}.${x}`] = [];
					}
					vision[`${y}.${x}`].push(ray);
				}
			});
		}
	}));

	// Run iterations
	let grid = res;
	let out = apply2(grid, vision);
	while (out.change) {
		// console.log(grid.map(x => x.join('')).join('\n'));
		// console.log('-------');
		grid = out.newGrid;
		out = apply2(grid, vision);
		// console.log(out.change, grid.map(x => x.join('')).join('\n'));
	}
	// console.log(grid.map(x => x.join('')).join('\n'));
	return fp.sum(
		grid.map(row => fp.sum(row.map(cell => Number(cell === OCCUPIED))))
	);
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
