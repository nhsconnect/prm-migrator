const fakePds = require('../fakepds');

describe("FakePDS calls work", () => {

    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        expect(await fakePds.verifyNhsNumber(nhsNoToVerify)).toBe(true);
    });

    test('we should be able to get an adequate response when validating an invalid NHS number', async () => {
        const nhsNoToVerify = "444444444444";
        expect(await fakePds.verifyNhsNumber(nhsNoToVerify)).toBe(false);
    });
});
