const validator = require("../validation");
const given = require('./given');
const pds_client = require('../temp_client');
jest.mock('../temp_client');

describe("Calling validation", () => {
    test("should return true if a given NHS number is valid.", () => {
        pds_client.verifyNhsNumber = function() { return true };
        expect(validator.isNhsNoValid(given.aNewRecord)).toBeTruthy();
    });

    test("should return false if a given NHS number is invalid.", () => {
        pds_client.verifyNhsNumber = function() { return false };
        expect(validator.isNhsNoValid(given.invalidNhsNoRecord)).toBeFalsy();
    });
});