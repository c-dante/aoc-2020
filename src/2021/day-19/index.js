import { inspect } from 'util';
import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';
import { gauss } from '../../gauss.js';
import { Vector4, Matrix4, formatValue } from '@math.gl/core';

const process = fp.flow(
	util.emptyLineGroupedReduce,
	fp.map(group => {
		const [_, scanner] = /scanner (\d+)\s/.exec(group.shift());
		const points = group.map(pt => {
			const [x, y, z] = pt.split(',').map(x => Number(x));
			return new Vector4(x, y, z, 1);
		});

		return {
			scanner: +scanner,
			points,
		};
	}),
);

const k = ({ dist }) => [dist].join(',');

const inc = (map, key) => {
	if (!map[key]) {
		map[key] = 0;
	}
	map[key]++;
}

// Get all scanner's points relative to the first observed
const getRelative = ({ points }) => {
	const pts = new Map();
	points.forEach((pt, i) => {
		points.forEach((other, j) => {
			if (i === j) return;
			const dist = pt.distanceSquared(other);
			const ref = { dist, i, j };
			const key = k(ref);
			if (pts.has(key)) {
				pts.get(key).push(ref);
			} else {
				pts.set(key, [ref]);
			}
		});
	});
	return pts;
};

const getMatches = (sA, sB) => {
	const matches = new Map();
	sA.forEach((pt, k) => {
		if (sB.has(k)) {
			const match = sB.get(k);

			pt.forEach(p => {
				[p.i, p.j].forEach(x => {
					match.forEach(m => {
						if (!matches.has(x)) {
							matches.set(x, {
								[m.i]: 1,
								[m.j]: 1,
							});
						} else {
							inc(matches.get(x), m.i);
							inc(matches.get(x), m.j);
						}
					})
				});
			})
		}
	});
	return matches;
}

const solveMapping = (matches) => {
	const mapping = {};
	let averageMax = 0;
	matches.forEach((candidates) => {
		averageMax += fp.max(Object.values(candidates));
	});
	averageMax /= matches.length;
	matches.forEach((candidates, source) => {
		const max = fp.flow(
			fp.toPairs,
			fp.maxBy('1'),
			// fp.get('0')
		)(candidates);
		// Drop weird outlier
		if (max < averageMax) {
			console.log(max);
		} else {
			mapping[source] = max[0];
		}

	});
	return mapping;
}

const buildPaths = transformMappings => {
	// Build the graph
	const graph = {};
	Object.keys(transformMappings).forEach(from => {
		if (!graph[from]) {
			graph[from] = { id: from, edges: {} };
		}
		Object.keys(transformMappings[from]).forEach(to => {
			if (!graph[to]) {
				graph[to] = { id: to, edges: {} };
			}
			// xform from -> to
			graph[from].edges[to] = transformMappings[from][to];
			// Add reverse edge
			graph[to].edges[from] = transformMappings[from][to].clone().invert();
		});
	});

	// Make a path from 0 to every node and save the invert back
	const go = (nodeId, mat, path) => {
		const node = graph[nodeId];
		if (!node.path) {
			node.path = mat.clone().invert();
			node.pathTaken = fp.reverse(path);
		} else {
			// If this node has a path to 0, no need to change it
			return;
		}

		// Crawl to connected nodes
		Object.keys(node.edges).forEach(edgeId => {
			if (graph[edgeId].path) return;
			const nextMat = mat.clone()
				.multiplyLeft(node.edges[edgeId]);
			go(edgeId, nextMat, path.concat(edgeId));
		});
	};
	go('0', new Matrix4(), ['0']);

	// console.log(fp.mapValues(x => x.pathTaken, graph))
	return fp.mapValues(x => x.path, graph);
};

const getTransformMapping = (scanners, relativeScanners) => {
	const transformMappings = {};
	relativeScanners.forEach((sA, i) => {
		for (let j = i + 1; j < relativeScanners.length; j++) {
			const sB = relativeScanners[j];
			const matches = getMatches(sA, sB);
			if (matches.size >= 12) {
				const mapping = solveMapping(matches);
				// Figure out the A to B mapping

				// I have i: [0, 11], R0 * T0 * p0_i -> R1 * T1 * p1_i
				// I can assume R0 and T0 are identity (everything relative to p0)
				// I can rewrite as
				// p0_i = M * p1_i
				// and
				// M^-1 * p0_1 = p1_i
				// Going to gaussian eliminate each component to solve the 4x4
				// that maps from scanner_n's points -> scanner_0's points
				// TODO: my mappings must be off -- I should try to pick based on most matches?
				// pick 4 random points -- todo, carlo this I guess????

				const eqs = fp.sampleSize(4, Object.keys(mapping)).reduce((acc, fromIdx) => {
					const fromPt = scanners[i].points[+fromIdx];
					const toPt = scanners[j].points[+mapping[fromIdx]];
					// xyzw
					acc.mat.push([...fromPt]);
					for (let i = 0; i < 4; i++) {
						acc.vecs[i].push(toPt[i]);
					}

					// return [...fromPt].concat(toPt.map(x => x * -1));
					return acc;
				}, {
					mat: [],
					vecs: [[], [], [], []],
				});
				const out = eqs.vecs.map(vec => {
					const safeMat = eqs.mat.map(x => x.slice());
					return gauss(safeMat, vec)
						.map(x => Math.round(x));
				});
				const A = new Matrix4(fp.flatten(out));
				A.transpose(); // ugh

				// Save the transformation matrix from j to i
				if (!transformMappings[i]) {
					transformMappings[i] = {};
				}
				transformMappings[i][j] = A;
			}
		}
	});
	return transformMappings;
}

export const part1 = (input) => {
	const scanners = process(input);

	// Index all beacons' distance and direction
	// to all other beacons within a frame of ref
	const relativeScanners = scanners.map(getRelative);

	// Check pairs of scanners to get overlapping beacons
	// Determine positions (and orientation?) of each scanner
	const transformMappings = getTransformMapping(scanners, relativeScanners);

	// Now I have transform edges between each sensor with >12 overlapping beacons
	// console.log(transformMappings);

	// Test that this worked
	// console.log(
	// 	transformMappings['0']['1'].transform(
	// 		new Vector4(-618, -824, -621, 1)
	// 	)
	// );
	const map = buildPaths(transformMappings);
	// console.log(map);

	// Now transform all into 0 space and unique
	const uniquePts = scanners.reduce((acc, scanner, i) => {
		scanner.points.forEach(pt => {
			const xform = map[i].transform(pt.clone())
				.map(x => Math.round(x));
			acc.add(xform.join(','));
		});
		return acc;
	}, new Set());

	const scannerPts = fp.toPairs(map)
		.map(pair => pair[1].getTranslation());


	let max = Number.MIN_SAFE_INTEGER;
	let maxPair = [];
	scannerPts.forEach((from, i) => {
		scannerPts.slice(i).forEach((to, j) => {
			const dist = fp.flow(
				fp.map(([a, b]) => Math.abs(a - b)),
				fp.sum
			)(fp.zip(from, to));

			if (dist > max) {
				max = dist;
				maxPair = { from, to, i, j: i + j }
			}
		});
	}); // 20386

	if (uniquePts.size === 359) {
		console.log({ max, maxPair });
	}

	return uniquePts.size;
};

export const part2 = (input) => {
	const scanners = process(input);

	// Index all beacons' distance and direction
	// to all other beacons within a frame of ref
	const relativeScanners = scanners.map(getRelative);

	// Check pairs of scanners to get overlapping beacons
	// Determine positions (and orientation?) of each scanner
	const transformMappings = getTransformMapping(scanners, relativeScanners);


	// xforms of 0 -> scanner
	const map = buildPaths(transformMappings);
	const scannerPts = fp.toPairs(map)
		.map(pair => pair[1].getTranslation());


	let max = Number.MIN_SAFE_INTEGER;
	let maxPair = [];
	scannerPts.forEach((from, i) => {
		scannerPts.slice(i).forEach((to, j) => {
			const dist = fp.flow(
				fp.map(([a, b]) => Math.abs(a - b)),
				fp.sum
			)(fp.zip(from, to));

			if (dist > max) {
				max = dist;
				maxPair = { from, to, i, j: i + j }
			}
		});
	}); // 20386

	return max;
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	// console.time('part 1');

	let avg = 0;
	let min = 100000;
	const observed = new Set();
	for (let i = 0; i < 500; i++) {
		const res = part1(input);
		observed.add(res);
		min = Math.min(res, min);
		console.log(res);
		avg += res;
	}
	console.log(avg / 500, min, observed);
	console.log('Part 1', part1(input));
	// console.timeEnd('part 1');
	// console.time('part 2');
	// console.log('Part 2', part2(input));
	// console.timeEnd('part 2');
};
main();
