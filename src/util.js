import fp from 'lodash/fp.js';

export const log = (x) => console.dir(x, { depth: null })

export const formatAsNumbers = numbers => numbers.split('\n').map(Number);

export const sliding = n => {
	const window = [];
	return fp.map((x) => {
		window.push(x);
		if (window.length > n) {
			window.shift();
		}
		return window.slice();
	});
};

/**
 * Helper to process input where lines are records and empty line "produces" a group
 *
 * @template Acc
 * @template Out
 * @param {String} input
 * @param {(Acc, String) => Acc} reducer - The reducer
 * @param {(Acc) => Out} producer - Convert the intermediate group (Acc) into an output
 * @param {() => Acc} newIntermediate - Construct a new initial value for the reduce state
 * @returns Out[]
 */
export const emptyLineGroupedReduce = (
	input,
	reducer = (acc, x) => { acc.push(x); return acc; },
	newIntermediate = () => [],
	producer = x => x,
) => input
	.split('\n')
	.concat('')
	.reduce((acc, row) => {
		if (row === '') {
			acc.outputs.push(producer(acc.intermediate));
			return {
				outputs: acc.outputs,
				intermediate: newIntermediate(),
			};
		}

		acc.intermediate = reducer(acc.intermediate, row);
		return acc;
	}, { outputs: [], intermediate: newIntermediate() })
		.outputs;

///////////////////////
// ----- graph ----- //
///////////////////////
export const toGraph = (nodes, edges) => {
	const byId = fp.keyBy('id', nodes);
	const children = fp.flow(
		fp.groupBy(x => x[0]),
		fp.mapValues(fp.flow(
			fp.map(x => x[1]),
			fp.uniq
		)),
	)(edges);
	const parents = fp.flow(
		fp.groupBy(x => x[1]),
		fp.mapValues(fp.flow(
			fp.map(x => x[0]),
			fp.uniq
		)),
	)(edges);
	return { nodes, byId, children, parents };
};

export const topo = (getDeps, id) => {
	const visited = new Set();
	const children = new Set();
	const recurse = (node) => {
		if (visited.has(node)) return;
		visited.add(node);
		children.add(node);
		getDeps(node).forEach(recurse);
	};
	getDeps(id).forEach(recurse);
	return [...children];
}

export const allChildren = (graph, id) => topo(
	node => (graph.children[node] ?? []),
	id
);

export const allParents = (graph, id) => topo(
	node => (graph.parents[node] ?? []),
	id
);

if (false) {
	const graph = toGraph(
		[
			{ id: 'a' },
			{ id: 'b' },
			{ id: 'c' },
			{ id: 'd' },
		],
		[
			['a', 'b'],
			['a', 'c'],
			['b', 'c'],
			['b', 'd'],
		]
	);
	log(graph);
	Object.keys(graph.byId).forEach(id => {
		console.log(id, 'allChildren', allChildren(graph, id));
		console.log(id, 'allParents', allParents(graph, id));
	});
}

///////////////////////
// ----- grid ------ //
///////////////////////
export const cardinal = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
];
export const diagonal = [
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];
export const rose = cardinal.concat(diagonal);

export const castRay = (grid, cb, y, x, dy, dx) => {
	let r = y + dy;
	let c = x + dx;
	while (
		r < grid.length &&
		c < grid[r]?.length &&
		cb(grid[r][c], grid, r, c) !== false
	) {
		r += dy;
		c += dx;
	}

	if (r < grid.length && c < grid[r]?.length) {
		return [r, c];
	}

	return undefined;
};

// ------
export const get2dGrid = (length) => Array.from({ length })
	.map(() => Array.from({ length }));

export const copyGrid = grid => grid.slice().map(x => x.slice());