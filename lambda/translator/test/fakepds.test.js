const fakePds = require('../fakepds');
const given = require('./given');

describe("FakePDS calls work", () => {

    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        const queryForSuccesfulResponse = given.buildNhsNoValidationQuery("9999345201");
        expect(await fakePds.verifyNhsNumber(queryForSuccesfulResponse)).toBe(given.verifyNhsNoResponse);
    });

    test('we should be able to get an adequate response when validating an invalid NHS number', async () => {
        expect.assertions(1);
        const queryForUnsuccesfulResponse = given.buildNhsNoValidationQuery("444444444444");
        await expect(fakePds.verifyNhsNumber(queryForUnsuccesfulResponse))
            .rejects.toEqual(given.verifyNhsNoInvalidResponse);
    });
});
