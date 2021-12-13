import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const SMALL = 1;
const LARGE = 2;

const isLarge = node => fp.upperCase(node) === node;

const process = fp.flow(
	fp.split('\n'),
	fp.map(x => x.split('-')),
	edges => {
		const nodeSet = edges.reduce((acc, edge) => {
			acc.add(edge[0]);
			acc.add(edge[1]);
			return acc;
		}, new Set());

		const andBack = edges
			.filter(e => e[0] !== 'start' || e[0] !== 'end' || e[1] !== 'start' || e[1] !== 'end')
			.map(edge => [edge[1], edge[0]])
			.concat(edges);

		return { nodes: [...nodeSet].map(id => ({ id })), edges: andBack };
	},
);

export const part1 = (input) => {
	const x = process(input);
	const graph = util.toGraph(x.nodes, x.edges);
	const paths = new Set();
	// console.log(graph);
	const go = (nodeId, path = [], visited = new Set()) => {
		if (nodeId === 'end') {
			paths.add(path.join(''));
			return;
		}

		if (!isLarge(nodeId) && visited.has(nodeId)) return;
		visited.add(nodeId);

		// Visit valid children
		graph.children[nodeId]
			.filter(child => isLarge(child) || !visited.has(child))
			.forEach(child => {
				go(child, path.concat(child), new Set([...visited]));
			});
	};
	go('start');
	// console.log(paths);
	return paths.size;
};

const canVisit = (nodeId, visited, smallVisit) => {
	const c = smallVisit ? 1 : 2;
	return isLarge(nodeId) || (visited[nodeId] ?? 0) < c;
}

export const part2 = (input) => {
	const x = process(input);
	const graph = util.toGraph(x.nodes, x.edges);
	// console.log(graph);
	const paths = new Set();
	const go = (nodeId, path = [], visited = {}, smallVisit = false) => {
		// console.log({ nodeId, path, visited });
		if (nodeId === 'end') {
			paths.add(path.join(''));
			return;
		}

		if (!visited[nodeId]) {
			visited[nodeId] = 0;
		}

		if (!canVisit(nodeId, visited, smallVisit)) return;
		visited[nodeId]++;
		const nextSmall = smallVisit || (!isLarge(nodeId) && visited[nodeId] >= 2);

		// Visit valid children
		graph.children[nodeId]
			.filter(x => x !== 'start' && canVisit(x, visited, nextSmall))
			.forEach(child => {
				go(child, path.concat(child), { ...visited }, nextSmall);
			});
	};
	go('start');
	// console.log(paths);
	return paths.size;
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
