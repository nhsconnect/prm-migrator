const fakePds = require('../fakepds');
const given = require('./given');

describe("FakePDS calls work", () => {

    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        expect(await fakePds.verifyNhsNumber(given.verifyNhsNoRequest)).toBe(given.verifyNhsNoResponse);
    });

    test('we should be able to get an adequate response when validating an invalid NHS number', async () => {
        expect.assertions(1);
        await expect(fakePds.verifyNhsNumber(given.verifyNhsNoInvalidRequest))
            .rejects.toEqual(given.verifyNhsNoInvalidResponse);
    });
});
