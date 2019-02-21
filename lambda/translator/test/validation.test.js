const validator = require("../validation");
const given = require('./given');
const pds_client = require('../temp_client');
jest.mock('../temp_client');

describe("Calling validation", () => {
    test("should return true if a given NHS number is valid.", async () => {
        pds_client.verifyNhsNumber = async function() { return true };
        expect(await validator.isNhsNoValid(given.aNewRecord)).toBeTruthy();
    });

    test("should return false if a given NHS number is invalid.", async () => {
        pds_client.verifyNhsNumber = async function() { return false };
        expect(await validator.isNhsNoValid(given.invalidNhsNoRecord)).toBeFalsy();
    });
});