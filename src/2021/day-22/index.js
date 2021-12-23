import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import Heap from 'heap';

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => {
		const [state, range] = x.split(' ');
		const pts = range.split(',')
			.reduce((acc, tuple) => {
				const [prop, range] = tuple.split('=')
				const [min, max] = range.split('..').map(Number);
				acc[prop] = [min, max];
				return acc;
			}, {});
		return { state, pts };
	}),
);

export const part1 = (input) => {
	const res = process(input);
	// clamp
	const grid = new Set();
	res.filter(
		cmd => cmd.pts.x.every(v => Math.abs(v) <= 50)
			&& cmd.pts.y.every(v => Math.abs(v) <= 50)
			&& cmd.pts.z.every(v => Math.abs(v) <= 50)
	).forEach(cmd => {
		const xRange = cmd.pts.x.map(fp.clamp(-50, 50));
		const yRange = cmd.pts.y.map(fp.clamp(-50, 50));
		const zRange = cmd.pts.z.map(fp.clamp(-50, 50));
		for (let x = xRange[0]; x <= xRange[1]; x++) {
			for (let y = yRange[0]; y <= yRange[1]; y++) {
				for (let z = zRange[0]; z <= zRange[1]; z++) {
					const pt = [x, y, z].join(',');
					if (cmd.state === 'on') {
						grid.add(pt);
					} else {
						grid.delete(pt);
					}
				}
			}
		}
	});
	return grid.size;
};

// check if the cube is fully inside
const inside = (left, right) => {
	const x = left.x[0] <= right.x[0] && left.x[1] >= right.x[1];
	const y = left.y[0] <= right.y[0] && left.y[1] >= right.y[1];
	const z = left.z[0] <= right.z[0] && left.z[1] >= right.z[1];
	return x && y && z;
};

// check if the cube overlaps with a side
const intersect = (left, right) => {
	const x = left.x[0] <= right.x[1] && left.x[1] >= right.x[0];
	const y = left.y[0] <= right.y[1] && left.y[1] >= right.y[0];
	const z = left.z[0] <= right.z[1] && left.z[1] >= right.z[0];
	return x && y && z;
};

// Removes toRemove from source + returns remaining cubes
const remove = (source, toRemove) => {
	// If source is fully inside, we have nothing left
	if (inside(toRemove, source)) {
		return [];
	}

	// If toRemove doesn't intersect, preserve source
	if (!intersect(source, toRemove)) {
		return [source];
	}

	// Grab overlaps to exclude
	const xOverlap = toRemove.x.filter(v => source.x[0] < v && v < source.x[1]);
	const yOverlap = toRemove.y.filter(v => source.y[0] < v && v < source.y[1]);
	const zOverlap = toRemove.z.filter(v => source.z[0] < v && v < source.z[1]);
	// console.log({ xOverlap, yOverlap, zOverlap });

	// Source -> [removed] -> source are the new cubes
	const results = util.sliding(2)([source.x[0]].concat(xOverlap, source.x[1])).slice(1)
		.flatMap(x =>
			util.sliding(2)([source.y[0]].concat(yOverlap, source.y[1])).slice(1)
				.flatMap(y =>
					util.sliding(2)([source.z[0]].concat(zOverlap, source.z[1])).slice(1)
						.map(z => ({ x, y, z }))
				)
		);

	// Finally, remove the insides after the splits
	return results.filter(x => !inside(toRemove, x));
};

const volume = cube => {
	const xRange = cube.x[1] - cube.x[0];
	const yRange = cube.y[1] - cube.y[0];
	const zRange = cube.z[1] - cube.z[0];
	return xRange * yRange * zRange;
}

export const part2 = (input) => {
	const res = process(input);

	// Maintain a state of on, non-overlapping cube
	const finalCubes = res.reduce((acc, cmd) => {
		// Adjust the end bounds to account for size 1 cubes
		cmd.pts.x[1]++;
		cmd.pts.y[1]++;
		cmd.pts.z[1]++;
		// Each time I add a cube to the state, remove it from all other cubes
		const removed = acc.flatMap(cube => remove(cube, cmd.pts));

		// If the cube to add is on, add it and move to next
		// Otherwise skip
		if (cmd.state === 'on') {
			removed.push(cmd.pts);
		}
		return removed;
	}, []);
	// console.log(finalCubes);
	return finalCubes.reduce((acc, cube) => acc + volume(cube), 0);
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
