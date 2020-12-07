import fs from 'fs';
import fp from 'lodash/fp.js';

export const part1 = (input) => {
	const out = input.split('\n').map(row => {
		const [_, color, content] = /([\w ]+) bags contain (.*)/.exec(row);

		const inside = content.split(',').map(inside => {
			const res = /(\d+) ([\w ]+) bags?/.exec(inside);
			if (res) {
				const [_, number, color] = res;
				return { number, color };
			}
			return undefined
		}).filter(x => x);

		return { color, content, inside };
	});

	const insideToOut = {};
	out.forEach(({ color: outside, inside }) => {
		inside.forEach(({ color }) => {
			if (!insideToOut[color]) {
				insideToOut[color] = new Set();
			}
			insideToOut[color].add(outside);
		});
	});

	const visited = new Set();
	const crawl = (color) => {
		if (visited.has(color)) return;
		visited.add(color);
		if (insideToOut[color]) {
			insideToOut[color].forEach(crawl);
		}
	}
	insideToOut['shiny gold'].forEach(crawl);

	return visited.size;
};

export const part2 = (input) => {
	const out = input.split('\n').map(row => {
		const [_, color, content] = /([\w ]+) bags contain (.*)/.exec(row);

		const inside = content.split(',').map(inside => {
			const res = /(\d+) ([\w ]+) bags?/.exec(inside);
			if (res) {
				const [_, number, color] = res;
				return { number, color };
			}
			return undefined
		}).filter(x => x);

		return { color, content, inside };
	});

	const outToIn = {};
	out.forEach(({ color: outside, inside }) => {
		if (!outToIn[outside]) {
			outToIn[outside] = {};
		}
		inside.forEach(({ color, number }) => {
			outToIn[outside][color] = number;
		});
	});

	const cache = {};
	const crawl = (color) => {
		if (cache[color] !== undefined) {
			return cache[color];
		}


		const children = outToIn[color] || {};
		const contents = Object.keys(children);
		if (contents.length === 0) {
			cache[color] = 1;
			return cache[color];
		}

		cache[color] = fp.sum(contents.map(inner => {
			const sub = crawl(inner);
			return sub * (+outToIn[color][inner]);
		})) + 1;

		return cache[color];
	}
	return crawl('shiny gold') - 1;
};

const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.log('Part 1', part1(input));
	console.log('Part 2', part2(input));
};
main();
