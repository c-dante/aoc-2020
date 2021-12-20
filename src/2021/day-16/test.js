import fp from 'lodash/fp.js';
import { part1, part2, process } from './index.js';

// const input = `D2FE28`;
const input = `9C0141080250320F1802104A08`;

console.log(
	'Part 1 (T)',
	part1(input),
	16
);

console.log(
	'Part 2 (T)',
	part2(input),
	'?'
);

// const toHex = fp.flow(
// 	fp.chunk(4),
// 	fp.map(fp.flow(
// 		fp.join(''),
// 		fp.padCharsStart('0', 4),
// 		fp.parseInt(2),
// 		x => x.toString(16)
// 	)),
// 	fp.join('')
// );

// const makeLiteral = fp.flow(
// 	x => x.toString(2),
// 	fp.chunk(4),
// 	fp.map(fp.flow(
// 		fp.join(''),
// 		fp.padCharsStart('0', 4),
// 	)),
// 	x => x.map((chunk, i, col) => {
// 		if (i === col.length - 1) {
// 			return `0${chunk}`;
// 		}
// 		return `1${chunk}`;
// 	}),
// 	fp.join('')
// );

// const makeMult = (parts) => {
// 	const numChildren = 2;
// 	return [
// 		'000',
// 		'001',
// 		'1',
// 		numChildren.toString(2).padStart(11, '0')
// 	].join('')
// };

// const getQuine = (a, b, c) => [
// 	makeMult(3), // a * b
// 	// Literals
// 	`000100${makeLiteral(a)}`,
// 	`000100${makeLiteral(b)}`,
// 	`000100${makeLiteral(c)}`,
// ];

// for (let i = 0; i < 999999999999999; i++) {
// 	const quine = getQuine(i, i, i);
// 	const inputSize = parseInt(toHex(quine.join('')), 16);
// 	const outputSize = part2(toHex(quine.join('')));
// 	console.log(inputSize - outputSize);
// 	if (outputSize > inputSize) {
// 		console.log('!!', i);
// 		break;
// 	}
// }

// (() => {
// 	const quine = getQuine(2, 2);
// 	console.log(
// 		toHex(quine.join('')),
// 		JSON.stringify(process(toHex(quine.join('')))),
// 		parseInt(toHex(quine.join('')), 16),
// 		part2(toHex(quine.join(''))),
// 		toHex(part2(toHex(quine.join(''))).toString(2)),
// 	);
// })();

