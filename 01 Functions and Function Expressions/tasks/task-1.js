/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	
*/

function sum(arr) {
	'use strict';
	var validator = {
		validateArrayLength: function (array) {
			if (array.length === 0) {
				return false;
			} else {
				return true;
			}
		},
		validateArguments: function (args) {
			var argsToArray = Array.prototype.slice.call(args);
			if (argsToArray.length === 0) {
				throw new Error('Parameter is not passed');
			}
		},
		validateNumbers: function (array) {
			array.forEach(function(element, index, array){
				if (isNaN(Number(element))) {
					throw new Error(name + ' At least one array index is not convertible to number');
				}
			});
		}
    };


	validator.validateArguments(arguments);
	validator.validateNumbers(arr);

	if (!validator.validateArrayLength(arr)) {
		return null;
	}

	return arr.reduce(function(previousValue, currentValue, index, array) {
		return previousValue + (+currentValue);
	}, 0);
}

module.exports = sum;