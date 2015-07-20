/* Task Description */
/* 
	*	Create a module for working with books
		*	The module must provide the following functionalities:
			*	Add a new book to category
				*	Each book has unique title, author and ISBN
				*	It must return the newly created book with assigned ID
				*	If the category is missing, it must be automatically created
			*	List all books
				*	Books are sorted by ID
				*	This can be done by author, by category or all
			*	List all categories
				*	Categories are sorted by ID
		*	Each book/catagory has a unique identifier (ID) that is a number greater than or equal to 1
			*	When adding a book/category, the ID is generated automatically
		*	Add validation everywhere, where possible
			*	Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
			*	Author is any non-empty string
			*	Unique params are Book title and Book ISBN
			*	Book ISBN is an unique code that contains either 10 or 13 digits
			*	If something is not valid - throw Error
*/
function solve() {
	var library = (function () {
		var books = [],
			categories = [];

		function listBooks(param) {
			var i,
				outPut = [],
				categoriesLength = categories.length;

			if (!param) {
				return books;
			}
			else{
				return getBooksByCategory(param.category);
			}
		}

		function getBooksByCategory(categoryName) {
			return books.filter(function(book){
				return book.category === categoryName;
			});
		}

		function addBook(book) {
			var bookCategory;
			
			validateBook(book);

			bookCategory = getCategoryByName(book.category);
			// If the category is new, it must be automatically created
			if (!bookCategory) {
				addCategory(book.category);
			}

			book.ID = books.length + 1;
			books.push(book);
			return book;
		}

		function listCategories() {
			return categories.map(function(element){
				return element['name'];
			});
		}

		function getCategoryByName(name){
			var i,
				categoriesLength = categories.length;

			for (i = 0; i < categoriesLength; i += 1) {
				if (categories[i]['name'] === name) {
					return categories[i];
				}
			}
			return false;
		}

        function addCategory(name) {
			var category = {};

            category['name'] = name;
            category['ID'] = categories.length + 1;

            categories.push(category);
        }

		function validateBook(book){
			var isUnique;

			// Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
			checkPropLength(book.title);
			checkPropLength(book.category);

			// Author is any non-empty string
			if (book.author.length === 0) {
				throw new Error('Invalid author');
			}

			// Unique title and ISBN
			isUnique = books.every(function(item){
				return item.title !== book.title && item.isbn !== book.isbn;
			});

			if (!isUnique) {
				throw new Error('Book has no unique title or isbn');
			}

			// ISBN contains either 10 or 13 digits
			if (!isNaN(Number(book.isbn)) && (book.isbn).toString().length !== 10 && (book.isbn).toString().length !== 13) {
				throw new Error('Invalid isbn');
			}

			// Helper function
			function checkPropLength(prop){
				if (prop.length <= 2 || prop.length >= 100) {
					throw new Error('Invalid property length');
				}
			}
		}

		return {
			books: {
				list: listBooks,
				add: addBook
			},
			categories: {
				list: listCategories
			}
		};
	} ());

	return library;
}

module.exports = solve;
