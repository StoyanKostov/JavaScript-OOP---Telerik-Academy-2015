/* Task Description */
/* 
	Create a function constructor for Person. Each Person must have:
	*	properties `firstname`, `lastname` and `age`
		*	firstname and lastname must always be strings between 3 and 20 characters, containing only Latin letters
		*	age must always be a number in the range 0 150
			*	the setter of age can receive a convertible-to-number value
		*	if any of the above is not met, throw Error
	*	property `fullname`
		*	the getter returns a string in the format 'FIRST_NAME LAST_NAME'
		*	the setter receives a string is the format 'FIRST_NAME LAST_NAME'
			*	it must parse it and set `firstname` and `lastname`
	*	method `introduce()` that returns a string in the format 'Hello! My name is FULL_NAME and I am AGE-years-old'
	*	all methods and properties must be attached to the prototype of the Person
	*	all methods and property setters must return this, if they are not supposed to return other value
		*	enables method-chaining
*/
function solve() {
	var Person = (function () {
		function Person(firstname, lastname, age) {
			this.firstname = firstname;
			this.lastname = lastname;
			this.age = age;
		}

		Person.prototype.introduce = function() {
			return 'Hello! My name is ' + this.fullname + ' and I am ' + this.age + '-years-old';
		};
		
		// Set getters and setters
		Object.defineProperties(Person.prototype, {
			'firstname': {
				get: function () {
					return this._firstname;
				},
				set: function (firstname) {
					if (!isNameValid(firstname)) {
						throw new Error('First name is invalid');
					}
					this._firstname = firstname;
				}
			},
			'lastname': {
				get: function () {
					return this._lastname;
				},
				set: function (lastname) {
					if (!isNameValid(lastname)) {
						throw new Error('Last name is invalid');
					}
					this._lastname = lastname;
				}
			},
			'fullname': {
				get: function () {
					return this.firstname + ' ' + this.lastname;
				},
				set: function (value) {
					var names = value.split(' ');
					this.firstname = names[0];
					this.lastname = names[1];
				}
			},
			'age': {
				get: function () {
					return this._age;
				},
				set: function (age) {
					if (!isAgeValid(age)) {
						throw new Error('Age is invalid');
					}
					this._age = age*1;
				}
			}
		});

		function isNameValid(name){
			return name.length >= 3 && name.length <= 20 && /[A-Za-z]/.test(name);
		}
		function isAgeValid(age){
			return !isNaN(Number(age)) && age >= 0 && age <= 150;
		}

		return Person;
	} ());
	
	return Person;
}

module.exports = solve;