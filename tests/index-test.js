/**
 * Created by enahum on 10/26/15.
 */
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var zimbra = require('passport-zimbra');

vows.describe('passport-zimbra').addBatch({

    'module': {
        'should report a version': function (x) {
            assert.isString(zimbra.version);
        },

        'should export BadRequestError': function (x) {
            assert.isFunction(zimbra.BadRequestError);
        }
    }

}).export(module);