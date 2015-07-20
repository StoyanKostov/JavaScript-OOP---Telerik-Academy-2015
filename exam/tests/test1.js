var Catalog = require('../tasks/task1.js')();
var expect = require('chai').expect;

describe('Test for Telerik Academy JavaScript OOP exam: ', function () {
    describe('Existence checks', function () {
        it('expect Catalog to be an object', function () {
            expect(Catalog).to.be.a('object');
        });
        it('expect Catalog.getBook to be a function', function () {
            expect(Catalog.getBook).to.be.a('function');
        });
        it('expect Catalog.getMedia to be a function', function () {
            expect(Catalog.getMedia).to.be.a('function');
        });
        it('expect Catalog.getBookCatalog to be a function', function () {
            expect(Catalog.getBookCatalog).to.be.a('function');
        });
        it('expect Catalog.getMediaCatalog to be a function', function () {
            expect(Catalog.getMediaCatalog).to.be.a('function');
        });
    });
    describe('Catalog validations', function () {
        it('expect to throw when name is less than between 2 characters', function () {
            function test() {
                var catalog = Catalog.getBookCatalog('a');
            }

            expect(test).to.throw();
        });
        it('expect to throw when name is more than between 40 characters', function () {
            function test() {
                var catalogName = '1SxzFy7mQnNlTuGoSOq41SxzFy7mQnNlTuGoSOq4a';
                var catalog = Catalog.getBookCatalog(str);
            }

            expect(test).to.throw();
        });
    });
});