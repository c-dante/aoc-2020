import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

const ACTIVE = '#';
const INACTIVE = '.';

const getId = (x, y, z, w) => [x, y, z, w].join(',');
const getXyz = (id) => id.split(',').map(Number);

export const part1 = (input) => {
	const activePoints = new Set();
	const pointActive = (x, y, z) => {
		return activePoints.has(getId(x, y, z));
	}

	const setPoint = (x, y, z, state) => {
		activePoints.add(getId(x, y, z));
	};

	const countActiveNeighbors = (x, y, z) => {
		let out = 0;
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (let dz = -1; dz <= 1; dz++) {
					if (dx === 0 && dy === 0 && dz === 0) continue;
					if (pointActive(x + dx, y + dy, z + dz)) {
						out++;
					}
				}
			}
		}
		return out;
	}

	input.split('\n')
		.map((row, y) => row.split('').forEach((state, x) => {
			if (state === ACTIVE) {
				setPoint(x, y, 0, state);
			}
		}));

	for (let i = 0; i < 6; i++) {
		const toAdd = [];
		const toRemove = [];
		const checked = new Set();
		activePoints.forEach((pointId) => {
			const [x, y, z] = getXyz(pointId);
			// First see if we remove this point
			const activeNeighbors = countActiveNeighbors(x, y, z);
			if (activeNeighbors !== 2 && activeNeighbors !== 3) {
				toRemove.push(getId(x, y, z));
			}

			// Next, check if we turn on anyone else
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					for (let dz = -1; dz <= 1; dz++) {
						if (dx === 0 && dy === 0 && dz === 0) continue;
						const id = getId(x + dx, y + dy, z + dz)
						if (checked.has(id) || activePoints.has(id)) continue;

						checked.add(id);
						if (countActiveNeighbors(x + dx, y + dy, z + dz) === 3) {
							toAdd.push(getId(x + dx, y + dy, z + dz));
						}
					}
				}
			}
		});

		toRemove.forEach(x => activePoints.delete(x));
		toAdd.forEach(x => activePoints.add(x));
	}

	return activePoints.size;
};

export const part2 = (input) => {
	const activePoints = new Set();
	const pointActive = (x, y, z, w) => {
		return activePoints.has(getId(x, y, z, w));
	}

	const setPoint = (x, y, z, w) => {
		activePoints.add(getId(x, y, z, w));
	};

	const countActiveNeighbors = (x, y, z, w) => {
		let out = 0;
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (let dz = -1; dz <= 1; dz++) {
					for (let dw = -1; dw <= 1; dw++) {
						if (dx === 0 && dy === 0 && dz === 0 && dw === 0) continue;
						if (pointActive(x + dx, y + dy, z + dz, w + dw)) {
							out++;
						}
					}
				}
			}
		}
		return out;
	}

	input.split('\n')
		.map((row, y) => row.split('').forEach((state, x) => {
			if (state === ACTIVE) {
				setPoint(x, y, 0, 0);
			}
		}));

	for (let i = 0; i < 6; i++) {
		const toAdd = [];
		const toRemove = [];
		const checked = new Set();
		activePoints.forEach((pointId) => {
			const [x, y, z, w] = getXyz(pointId);
			// First see if we remove this point
			const activeNeighbors = countActiveNeighbors(x, y, z, w);
			if (activeNeighbors !== 2 && activeNeighbors !== 3) {
				toRemove.push(getId(x, y, z, w));
			}

			// Next, check if we turn on anyone else
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					for (let dz = -1; dz <= 1; dz++) {
						for (let dw = -1; dw <= 1; dw++) {
							if (dx === 0 && dy === 0 && dz === 0 && dw === 0) continue;
							const id = getId(x + dx, y + dy, z + dz, w + dw)
							if (checked.has(id) || activePoints.has(id)) continue;

							checked.add(id);
							if (countActiveNeighbors(x + dx, y + dy, z + dz, w + dw) === 3) {
								toAdd.push(getId(x + dx, y + dy, z + dz, w + dw));
							}
						}
					}
				}
			}
		});

		toRemove.forEach(x => activePoints.delete(x));
		toAdd.forEach(x => activePoints.add(x));
	}

	return activePoints.size;
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
