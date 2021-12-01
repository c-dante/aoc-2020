import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../../util.js';

const dirs = ['N', 'E', 'S', 'W'];

export const part1 = (input) => {
	const start = [0, 0];
	const res = input.split('\n').reduce((acc, cmd) => {
		// console.log(acc, cmd);
		const { coord, heading } = acc;
		let [x, y] = coord;
		let num = +cmd.slice(1);
		if (cmd[0] === 'N') {
			return {
				coord: [x, y + num],
				heading,
			};
		}
		if (cmd[0] === 'S') {
			return {
				coord: [x, y - num],
				heading,
			};
		}
		if (cmd[0] === 'E') {
			return {
				coord: [x + num, y],
				heading,
			};
		}
		if (cmd[0] === 'W') {
			return {
				coord: [x - num, y],
				heading,
			};
		}

		if (cmd[0] === 'F') {
			if (heading === 'N') {
				y += num;
			}
			if (heading === 'S') {
				y -= num;
			}
			if (heading === 'E') {
				x += num;
			}
			if (heading === 'W') {
				x -= num;
			}
			return {
				coord: [x, y],
				heading,
			};
		}

		if (cmd[0] === 'L') {
			num = num / 90;
			let i = dirs.indexOf(heading);
			i -= num
			if (i < 0) i += dirs.length;
			i = i % dirs.length;
			return {
				coord: [x, y],
				heading: dirs[i],
			};
		}

		if (cmd[0] === 'R') {
			num = num / 90;
			let i = dirs.indexOf(heading);
			i += num
			if (i < 0) i += dirs.length;
			i = i % dirs.length;
			return {
				coord: [x, y],
				heading: dirs[i],
			};
		}
	}, { coord: start, heading: 'E' });

	// console.log(res);
	return Math.abs(res.coord[0]) + Math.abs(res.coord[1]);
};

const rot = (x, y, degrees) => {
	const rad = (Math.PI / 180) * degrees;

	return [
		x * Math.cos(rad) - y * Math.sin(rad),
		x * Math.sin(rad) + y * Math.cos(rad),
	];
}

export const part2 = (input) => {
	const res = input.split('\n').reduce((acc, cmd) => {
		// console.log(acc, cmd);
		const { coord, wp, heading } = acc;
		let num = +cmd.slice(1);
		if (cmd[0] === 'N') {
			return {
				coord,
				wp: [wp[0], wp[1] + num],
			};
		}
		if (cmd[0] === 'S') {
			return {
				coord,
				wp: [wp[0], wp[1] - num],
			};
		}
		if (cmd[0] === 'E') {
			return {
				coord,
				wp: [wp[0] + num, wp[1]],
			};
		}
		if (cmd[0] === 'W') {
			return {
				coord,
				wp: [wp[0] - num, wp[1]],
			};
		}

		if (cmd[0] === 'F') {
			const dx = wp[0] * num;
			const dy = wp[1] * num;
			return {
				coord: [coord[0] + dx, coord[1] + dy],
				wp,
			};
		}

		if (cmd[0] === 'L') {
			return {
				coord,
				wp: rot(wp[0], wp[1], num).map(x => Math.round(x)),
			};
		}

		if (cmd[0] === 'R') {
			return {
				coord,
				wp: rot(wp[0], wp[1], -num).map(x => Math.round(x)),
			};
		}
	}, {
		coord: [0, 0],
		wp: [10, 1]
	});

	// console.log(res);
	return Math.abs(res.coord[0]) + Math.abs(res.coord[1]);
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
