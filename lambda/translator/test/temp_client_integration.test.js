const pds_client = require('../temp_client');

describe.skip("PDS calls actually do work", () => {
    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(true);
    });
    
    test('we should be able to get an adequate response when validating an invalid NHS number', async () => {
        const nhsNoToVerify = "abcd1234";
        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(false);
    });
});