const validator = require("../validation");

describe("Calling validation", () => {
    test("should return true if a given NHS number is valid.", () => {
       expect(validator.isNhsNoValid(123)).toBeTruthy();
    });

    test("should return false if a given NHS number is invalid.", () => {
        expect(validator.isNhsNoValid(124)).toBeFalsy();
    });
});