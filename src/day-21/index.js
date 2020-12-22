import fs from 'fs';
import fp from 'lodash/fp.js';
import * as util from '../util.js';

export const part1 = (input) => {
	const foods = input.split('\n').map(str => {
		const x = str.split(' (contains');
		const ingredients = x[0].split(' ').filter(x => x);
		const allergens = x[1].slice(0, -1)
			.split(',')
			.map(x => x.trim());
		return { ingredients, allergens };
	});

	const {
		constraints,
		allergens,
		foodCounts,
	} = foods.reduce((acc, { ingredients, allergens }) => {
		// Constraints
		acc.constraints.push({ ingredients, allergens });

		// Possibilities
		allergens.forEach(a => {
			if (!acc.allergens[a]) {
				acc.allergens[a] = new Set();
			}

			ingredients.forEach(i => {
				acc.allergens[a].add(i);
				if (!acc.foods[i]) {
					acc.foods[i] = new Set();
				}
				acc.foods[i].add(a);
			});
		});

		// Counts
		ingredients.forEach(i => {
			if (!acc.foodCounts[i]) {
				acc.foodCounts[i] = 0;
			}
			acc.foodCounts[i]++;
		});

		return acc;
	}, {
		constraints: [],
		allergens: {},
		foods: {},
		foodCounts: {},
	});

	// Each allergen is found in exactly one ingredient
	// Each ingredient contains zero or one allergen

	const sortedConstrain = fp.sortBy(
		x => x.allergens.length,
		constraints
	);


	if (sortedConstrain[0].allergens.length > 1) {
		console.warn('oops');
	}

	const toId = (foodMap) => {
		const res = fp.sortBy(x => x[0], Object.entries(foodMap))
			.map(x => x.join('->'))
			.join(',');
		return res;
	}
	const solve = () => {
		const attempted = new Set();
		const queue = sortedConstrain[0].ingredients.map(
			ingredient => ({ [ingredient]: sortedConstrain[0].allergens[0] }),
		);
		while (queue.length) {
			const thisMap = queue.pop();
			if (attempted.has(toId(thisMap))) {
				continue;
			}
			const invertMap = fp.invert(thisMap);
			attempted.add(toId(thisMap));

			// Account for allergens
			const unassignedAllergens = new Set(Object.keys(allergens));
			Object.values(thisMap).forEach(a => unassignedAllergens.delete(a));

			// Attempt to solve with assignments
			const candidates = [];
			let canUseCandidates = true;
			for (const constrain of sortedConstrain) {
				const ingredients = constrain.ingredients.filter(ingredient => !thisMap[ingredient]);
				const allergens = constrain.allergens.filter(x => {
					return !constrain.ingredients.some(ingredient => thisMap[ingredient] === x)
				});

				// If an allergen is mapped to a food not in this set, that's an error
				if (allergens.some(a => invertMap[a])) {
					canUseCandidates = false;
					break;
				}

				// If no allergens left, cannot learn anything more for this constraint
				if (allergens.length === 0) {
					continue;
				}

				if (ingredients.length === 0 && allergens.length > 0) {
					// This is an invalid configuration, so ignore any work and continue to next
					canUseCandidates = false;
					break;
				}

				// Otherwise, can we deduce?
				if (ingredients.length === 1 && allergens.length === 1) {
					if (thisMap[ingredients[0]]) {
						canUseCandidates = false;
						break;
					}

					thisMap[ingredients[0]] = allergens[0];
					invertMap[allergens[0]] = ingredients[0];
					unassignedAllergens.delete(allergens[0]);
					continue;
				}

				// Finally, push the possibilities into the queue
				// console.log('Next: ', { constrain, ingredients, allergens });
				ingredients.forEach(ingredient => {
					allergens.forEach(a => {
						if (!thisMap[ingredient] && !invertMap[a]) {
							candidates.push({
								[ingredient]: a,
								...thisMap,
							});
						}
					});
				});
			}

			if (canUseCandidates) {
				if (unassignedAllergens.size === 0) {
					return thisMap;
				}

				queue.push(...candidates);
			}
		}
	}
	const solvedFoodMap = solve();
	const noAllergen = Object.keys(foodCounts)
		.filter(food => !solvedFoodMap[food])

	console.log(solvedFoodMap);
	console.log(fp.flow(
		fp.sortBy(x => x[1]),
		fp.map(x => x[0]),
		fp.join(','),
	)(fp.toPairs(solvedFoodMap)));

	return fp.sum(
		noAllergen.map(key => foodCounts[key])
	);
};

export const part2 = () => {
};


const main = () => {
	const input = fs.readFileSync('./input.txt').toString();
	console.time('part 1');
	console.log('Part 1', part1(input));
	console.timeEnd('part 1');
	console.time('part 2');
	console.log('Part 2', part2(input));
	console.timeEnd('part 2');
};
main();
