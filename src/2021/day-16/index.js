import fs from 'fs';
import fp from 'lodash/fp.js';
import Heap from 'heap';
import * as util from '../../util.js';

const readLiteral = (bits) => {
	const chunks = [];
	let chunk;
	do {
		chunk = bits.splice(0, 5);
		chunks.push(chunk.slice(1));
	} while (chunk[0] === '1');
	return parseInt(chunks.map(x => x.join('')).join(''), 2);
};

const parseBits = (bits, maxPackets = -1) => {
	const packets = [];
	while (bits.length > 0) {
		// Read header
		const version = parseInt(bits.splice(0, 3).join(''), 2);
		if (bits.length <= 0) {
			return packets;
		}

		const id = parseInt(bits.splice(0, 3).join(''), 2);

		// Literal
		if (id === 4) {
			const value = readLiteral(bits);
			packets.push({ id, value, version });

			// Operators
		} else if (bits.shift() === '0') {
			const totalLength = parseInt(bits.splice(0, 15).join(''), 2);
			const subPackets = parseBits(bits.splice(0, totalLength));
			packets.push({ id, version, subPackets });
		} else {
			const numSub = parseInt(bits.splice(0, 11).join(''), 2);
			const subPackets = parseBits(bits, numSub);
			packets.push({ id, version, subPackets });
		}

		if (packets.length === maxPackets) {
			return packets;
		}
	}

	return packets;
}

const process = fp.flow(
	fp.split(''),
	fp.flatMap(hex => parseInt(hex, 16)
		.toString(2)
		.padStart(4, '0')
		.split('')),
	parseBits
);

const sumVersions = packets => packets.reduce(
	(acc, packet) => {
		const childSum = packet.subPackets ? sumVersions(packet.subPackets) : 0;
		return acc + packet.version + childSum;
	}, 0);

export const part1 = (input) => {
	const packets = process(input);
	return sumVersions(packets);
};

export const part2 = (input) => {
	const res = process(input);
	const go = (node) => {
		switch (node.id) {
			case 0:
				return node.subPackets
					.map(go)
					.reduce((a, b) => a + b, 0);
			case 1:
				return node.subPackets
					.map(go)
					.reduce((a, b) => a * b, 1);
			case 2:
				return node.subPackets
					.map(go)
					.reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER);
			case 3:
				return node.subPackets
					.map(go)
					.reduce((a, b) => Math.max(a, b), Number.MIN_SAFE_INTEGER);
			case 4: return node.value;
			case 5: {
				const [a, b] = node.subPackets.map(go);
				return a > b ? 1 : 0;
			}
			case 6: {
				const [a, b] = node.subPackets.map(go);
				return a < b ? 1 : 0;
			}
			case 7: {
				const [a, b] = node.subPackets.map(go);
				return a === b ? 1 : 0;
			}
		}
	}
	// console.log(res);
	return go(res[0]);
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
