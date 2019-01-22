const validator = require("../validation");
const given = require('./given');

describe("Calling validation", () => {
    test("should return true if a given NHS number is valid.", () => {
       expect(validator.isNhsNoValid(given.aNewRecord)).toBeTruthy();
    });

    test("should return false if a given NHS number is invalid.", () => {
        expect(validator.isNhsNoValid(given.invalidNhsNoRecord)).toBeFalsy();
    });
});