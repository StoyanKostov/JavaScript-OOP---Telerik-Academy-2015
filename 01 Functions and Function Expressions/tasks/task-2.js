/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/

function findPrimes(from, to) {
	var primesArr = [],
		start,
		end;

	if (isNaN(Number(from)) || isNaN(Number(to))) {
		throw new Error('At least one param is not convertible to `Number` or not passed');
	}

	// Exchange range values if nessesary for while loop condition
	if (from > to) {
		start = +to;
		end = +from;
	}
	else{
		start = +from;
		end = +to;
	}

	while(start <= end){
		if (isPrime(start)) {
			primesArr.push(start);
		}
		start += 1;
	}

	return primesArr;
}


function isPrime(num){
	var i,
		numSquareRoot;

	if (num <= 1) {
		return false;
	}else if (num === 2) {
		return num;
	}

	numSquareRoot = Math.ceil(Math.sqrt(num));

	for (i = 2; i <= numSquareRoot; i++) {
		if (num % i === 0) {
			return false;
		}
	}

	return num;
}

module.exports = findPrimes;
