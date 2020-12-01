import { formatAsNumbers } from '../util.js';
import { findSum } from './day-01.js';

const input = `1721
979
366
299
675
1456`;

const expected = 514579;

console.log(
	findSum(formatAsNumbers(input)) === expected
);
