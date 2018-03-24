'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils');

describe('#isInRange', function() {
    it('should return true if exist min a max and value is >= min and <= max', function() {
        var result = utils.isInRange(0, 0, 10);
        expect(result).to.equal(true);
    });

    it('should return true if does not exist min and value is <= max', function() {
        var result = utils.isInRange(10, null, 10);
        expect(result).to.equal(true);
    });

    it('should return true if does not exist max and value is >= min', function() {
        var result = utils.isInRange(5, 0, null);
        expect(result).to.equal(true);
    });

    it('should return true if does not exist max and min', function() {
        var result = utils.isInRange(5, null, null);
        expect(result).to.equal(true);
    });

    it('should return false if value is < min', function() {
        var result = utils.isInRange(5, 6, null);
        expect(result).to.equal(false);
    });

    it('should return false if value is > max', function() {
        var result = utils.isInRange(10, 6, 8);
        expect(result).to.equal(false);
    });
});