const pds_client = require('../temp_client');
const given = require('./temp_given');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const AWS = require('aws-sdk-mock');

describe("PDS calls work", () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
        AWS.mock('SSM', 'getParameter', "1234ABCD");
    });

    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        mock.onPost('https://192.168.128.11/smsp/pds', pds_client.generateRequest(nhsNoToVerify)).reply(200, given.generateValidPdsResponseFor(nhsNoToVerify));
        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(true);
    });

    test('we should be able to get an adequate response when validating a invalid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        mock.onPost('https://192.168.128.11/smsp/pds', pds_client.generateRequest(nhsNoToVerify)).reply(200, given.generateInvalidPdsResponseFor(nhsNoToVerify));
        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(false);
    });

    afterAll(() => {
        mock.restore();
        AWS.restore('SSM');
    });
});