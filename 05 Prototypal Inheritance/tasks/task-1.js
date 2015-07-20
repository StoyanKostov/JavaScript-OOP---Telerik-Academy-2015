/* Task Description */
/*
* Create an object domElement, that has the following properties and methods:
  * use prototypal inheritance, without function constructors
  * method init() that gets the domElement type
    * i.e. `Object.create(domElement).init('div')`
  * property type that is the type of the domElement
    * a valid type is any non-empty string that contains only Latin letters and digits
  * property innerHTML of type string
    * gets the domElement, parsed as valid HTML
      * <type attr1="value1" attr2="value2" ...> .. content / children's.innerHTML .. </type>
  * property content of type string
    * sets the content of the element
    * works only if there are no children
  * property attributes
    * each attribute has name and value
    * a valid attribute has a non-empty string for a name that contains only Latin letters and digits or dashes (-)
  * property children
    * each child is a domElement or a string
  * property parent
    * parent is a domElement
  * method appendChild(domElement / string)
    * appends to the end of children list
  * method addAttribute(name, value)
    * throw Error if type is not valid
  * method removeAttribute(attribute)
    * throw Error if attribute does not exist in the domElement
*/


/* Example

var meta = Object.create(domElement)
	.init('meta')
	.addAttribute('charset', 'utf-8');

var head = Object.create(domElement)
	.init('head')
	.appendChild(meta)

var div = Object.create(domElement)
	.init('div')
	.addAttribute('style', 'font-size: 42px');

div.content = 'Hello, world!';

var body = Object.create(domElement)
	.init('body')
	.appendChild(div)
	.addAttribute('id', 'cuki')
	.addAttribute('bgcolor', '#012345');

var root = Object.create(domElement)
	.init('html')
	.appendChild(head)
	.appendChild(body);

console.log(root.innerHTML);
Outputs:
<html><head><meta charset="utf-8"></meta></head><body bgcolor="#012345" id="cuki"><div style="font-size: 42px">Hello, world!</div></body></html>
*/


function solve() {
	var domElement = (function () {

		function sortAttributes(array){
			return array.sort(function (a, b) {
					if (a.name > b.name) {
						return 1;
					}
					if (a.name < b.name) {
						return -1;
					}
					// a must be equal to b
					return 0;
				});
		}

		function isValidType(type){
			var isValid = /^[A-Za-z0-9]{1,}$/.test(type) && typeof type === 'string';

			if (!isValid) {
				throw new Error('Not valid type!');
			}

			return isValid;
		}

		function isValidAttribute(attribute){
			var isValid = /^[A-Za-z0-9-]{1,}$/.test(attribute) && typeof attribute === 'string';

			if (!isValid) {
				throw new Error('Not valid type!');
			}

			return isValid;
		}

		function isValidChild(child){
			var isValid = typeof child === 'string' || child instanceof domElement;

			if (!isValid) {
				throw new Error('Not valid type!');
			}

			return isValid;
		}

		var domElement = {
			init: function(type) {
				this.type = type;
				this.innerHTML = '';
				this.content = '';
				this.attributes = []; //{name: value}
				this.children = [];
				this.parent;

				return this;
			},
			appendChild: function(child) {
				if (Object.getPrototypeOf(this).isPrototypeOf(child)) {
					child.parent = this;
				}

				this.children.push(child);
				return this;
			},
			addAttribute: function(name, value) {
				if (isValidAttribute(name)) {
					var found = false;
					this.attributes.forEach(function(element, index, array){
						if (element.name === name) {
							element.value = value;
							found = true;
						}
					});
					
					if (!found) {
						this.attributes.push({'name': name, 'value': value});
					}

					return this;
				}

			},
			removeAttribute: function(attribute) {
				var found = false;
				this.attributes = this.attributes.filter(function(attr){
					if (attr.name === attribute) {
						found = true;
					}
					return attr.name !== attribute;
				});

				if (!found) {
					throw new Error('attribute does not exist');
				}

				return this;
			},
			set type(value){
				if (isValidType(value)) {
					this._type = value;
				}
			},
			get type(){
				return this._type;
			},
			get innerHTML(){
				var markUp = '<' + this.type;

				if (this.attributes.length > 0) {
					var sortedAttributes = sortAttributes(this.attributes);

					sortedAttributes.forEach(function(element, index, array){
						markUp += ' ' + element.name + '="' + element.value + '"';
					});
				}

				markUp += '>';
				
				if (this.children.length > 0) {
					this.children.forEach(function(element, index, array){
						if (typeof element === 'string') {
							markUp += element;
						} else {
							markUp += element.innerHTML;
						}
					});
				} else {
					markUp += this.content;
				}

				markUp += '</' + this.type + '>';

				return markUp;
			}
		};
		return domElement;
	} ());
	return domElement;
}

module.exports = solve;
