export const formatAsNumbers = numbers => numbers.split('\n').map(Number);

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
	reducer,
	newIntermediate,
	producer = x => x,
) => input
	.split('\n')
	.concat('')
	.reduce((acc, row) => {
		if (row === '') {
			return {
				outputs: acc.outputs.concat(producer(acc.intermediate)),
				intermediate: newIntermediate(),
			};
		}

		acc.intermediate = reducer(acc.intermediate, row);
		return acc;
	}, { outputs: [], intermediate: newIntermediate() })
	.outputs;