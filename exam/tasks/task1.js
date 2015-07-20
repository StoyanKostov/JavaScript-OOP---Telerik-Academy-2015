function solve(){
	var Catalog = (function(){
		var Item,
			Book,
			Media,
			Catalog,
			BookCatalog,
			MediaCatalog,
			validator,
			CONSTANTS = {
            };

        validator = {
        	validateIfUndefined: function (val, name) {
        		name = name || 'Value';
        		if (val === undefined) {
        			throw new Error(name + ' cannot be undefined');
        		}
        	},
        	validateString: function (val, name, min, max ) {
        		name = name || 'Value';
        		this.validateIfUndefined(val, name);

        		if (typeof val !== 'string') {
        			throw new Error(name + ' must be a string');
        		}

        		if (val.length === 0) {
        			throw new Error(name + ' can not be empty string');
        		}

        		if (typeof min !== 'undefined' && typeof max !== 'undefined') {
        			if (min > val.length || max < val.length ) {
        				throw new Error(name + ' must be between ' + min + ' and ' + max + ' symbols');
        			}
        		}
        	},
            validateNumbers: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);

                if (isNaN(Number(val))) {
                    throw new Error(name + ' must be a number');
                }
            },
            validatePositiveNumbers: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                this.validateNumbers(val, name);
                if (val <= 0) {
                    throw new Error(name + ' must be a positive number');
                }
            },
            validateGreaterThan: function (small, big, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                this.validateNumbers(val, name);
                if (big <= small) {
                    throw new Error(name + ' must be a positive number');
                }
            },
            validateNumbersInRange: function (val, name, min, max) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                this.validateNumbers(val, name);
                if (min > val || val > max) {
                    throw new Error(name + ' must be a in range' + min + " " + max);
                }
            },
            validateIsbn: function (val, name, min, max) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                this.validateNumbers(val, name);
                this.validateString(val, name, 10, 13 );
            },
            validateType: function (itemPrototype, item, name) {
                name = name || 'Value';

				if (!itemPrototype.isPrototypeOf(item)) {
					throw new Error(name + itemPrototype + ' is not prototype of ' + item);
				}
            },
            hasLength: function (param, name) {
                name = name || 'Value';
				if (param.length === 0) {
					throw new Error(name + ' length is 0 ');
				}
            }
		};

		Item = (function(){
			var currentItemId = 0,
				Item = Object.create({}, {
					"init": {
						value: function(description, name){
							this._id = ++currentItemId;
							this.description = description;
							this.name = name;
							return this;
						}
					},
					"id": {
						get: function () {
							return this._id;
						}
					},
					"description": {
					get: function () {
						return this._description;
					},
						set: function(val){
							validator.validateString(val, 'Item description');
							this._description = val;
						}
					},
					"name": {
						get: function () {
							return this._name;
						},
						set: function(val){
							validator.validateString(val, 'Item name', 2, 40);
							this._name = val;
						}
					}
				});

			return Item;
		}());

		Book = (function(parent){
			var Book = Object.create(parent, {
				init: { //name, isbn, genre, description
					value: function(name, isbn, genre, description){ // 
						parent.init.call(this, description, name);
						this.isbn = isbn;
						this.genre = genre;
						return this;
					}
				},
				isbn: {
					get: function () {
						return this._isbn;
					},
					set: function(val){
						validator.validateIsbn(val, 'Book isbn');
						this._isbn = val;
					}
				},
				genre: {
					get: function () {
						return this._genre;
					},
					set: function(val){
						validator.validateString(val, 'Book genre', 2, 20);
						this._genre = val;
					}
				}
			});
			

			return Book;
		}(Item));

		Media = (function(parent){
			var Media = Object.create(parent, {
				init: {// name, rating, duration, description
					value: function(name, rating, duration, description){
						parent.init.call(this, description, name);
						this.duration = duration;
						this.rating = rating;
						return this;
					}
				},
				duration: {
					get: function () {
						return this._duration;
					},
					set: function(val){
						validator.validatePositiveNumbers(val, 'Media duration');
						this._duration = val;
					}
				},
				rating: {
					get: function () {
						return this._rating;
					},
					set: function(val){
						validator.validateNumbersInRange(val, 'Media rating', 1, 5);
						this._rating = val;
					}
				}
			});

			return Media;
		}(Item));

		Catalog = (function(itemPrototype){
			var currentCatalogId = 0,
				Catalog = Object.create({}, {
					"init": {
					value: function(name){
						this._id = ++currentCatalogId;
						this.name = name;
						this.items = [];
						this.itemPrototype = itemPrototype;
						return this;
					}
					},
					"id": {
						get: function () {
							return this._id;
						}
					},
					"name": {
						get: function () {
							return this._name;
						},
						set: function(val){
							validator.validateString(val, 'Catalog name', 2, 40);
							this._name = val;
						}
					},
					"add": {
						value: function () {
							var args,
								isObject,
								self = this;

							if(Array.isArray(arguments[0])){
								args = Array.prototype.slice.call(arguments[0]);
							} else {
								args = Array.prototype.slice.call(arguments);
							}

							if (args.length === 0) {
								throw new Error('add args.length === 0');
							}

							args.forEach(function(arg){
								validator.validateType(self.itemPrototype, arg, 'Catalog ');
							});
							
							self.items = self.items.concat(args);
							
							return this;
						}
					},
					"find": {
						value: function (params) {
							var foundItems = [];

							validator.hasLength(arguments, 'catalog arguments ');

							//find by passed Options
							if(params instanceof Object){ // {id: 2, name: 'samsung gaLAxy s2'}
								var options = params,
									self = this;

								self.items.forEach(function(item){
									var found = true;
									for(var option in options){
										if (item[option] !== options[option]) {
											found = false;
										}
									}
									if (found) {
										foundItems.push(item);
									}
								});

								return foundItems.slice();
							}

							// find by passed Id
							validator.validateNumbers(params, 'catalog find by id');

							foundItems = this.items.filter(function(item){
								return item.id == params;
							});

							return  foundItems.slice();
						}
					},
					"search": {
						value: function (filter) {
							validator.validateString(filter, 'catalog search');

							var filteredItems = [],
								pattern = new RegExp(filter, "gi");
							
							filteredItems = this.items.filter(function(item){
								return pattern.test(item.name) || pattern.test(item.description);
							});

							return filteredItems.slice();
						}
					}
				});

			return Catalog;
		}(Item));
		
		BookCatalog = (function(parent, itemPrototype){
			var BookCatalog = Object.create(parent, {
				init: {// description, name, duration, rating
					value: function(name){
						parent.init.call(this, name);
						this.itemPrototype = itemPrototype;
						return this;
					}
				},
				add: {
					value: function(){
						parent.add.apply(this, arguments);
					}
				},
				getGenres: {
					value: function(){
						var genres = [],
							genre = this.items[0]['genre'].toLowerCase();

						genres.push(genre);

						for (var i = 1; i < this.items.length; i++) {
							genre = this.items[i]['genre'].toLowerCase();
							if (genres.indexOf(genre) === -1) {
								genres.push(genre);
							}
							
						}

						return genres;
					}
				}
			});

			return BookCatalog;
		}(Catalog, Book));

		MediaCatalog = (function(parent, itemPrototype){
			var MediaCatalog = Object.create(parent, {
				init: {// description, name, duration, rating
					value: function(name){
						parent.init.call(this, name);
						this.itemPrototype = itemPrototype;
						return this;
					}
				},
				add: {
					value: function(){
						parent.add.apply(this, arguments);
					}
				},
				getTop: {
					value: function(count){
						validator.validateGreaterThan(1, count,'MediaCatalog.getTop(count)');
						var sortedMedias = [];
						sortedMedias = this.items.sort(function(a, b){
							if (a.rating > b.rating) {
								return 1;
							}
							if (a.rating < b.rating) {
								return -1;
							}
							// a must be equal to b
							return 0;
						});

						return sortedMedias.slice(0, count);
					}
				},
				getSortedByDuration: {
					value: function(){
						var sortedMedias = [];
						sortedMedias = this.items.sort(function(a, b){
							// descending by duration
							if (a.duration > b.duration) {
								return -1;
							}
							if (a.duration < b.duration) {
								return 1;
							}
							// ascending by id
							if (a.id > b.id) {
								return 1;
							}
							if (a.id < b.id) {
								return -1;
							}

							// a must be equal to b
							return 0;
						});

						return sortedMedias.slice(0, count);
					}
				}
			});

			return MediaCatalog;
		}(Catalog, Media));

		return {
			getBook: function (name, isbn, genre, description) {//description, name, isbn, genre //description, name
				return Object.create(Book).init(name, isbn, genre, description);
			},
			getMedia: function (name, rating, duration, description) {
				return Object.create(Media).init(name, rating, duration, description);
			},
			getBookCatalog: function (name) {
				return Object.create(BookCatalog).init(name);
			},
			getMediaCatalog: function (name) {
				return Object.create(MediaCatalog).init(name);
			}
		};
	}());

	return Catalog;
}
//var module = solve();
module.exports = solve;