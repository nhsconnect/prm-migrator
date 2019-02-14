const pds_client = require('../pds_client');
const given = require('./given');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let mock;

beforeAll(() => {
    mock = new MockAdapter(axios);
});

describe("PDS calls work", () => {

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
});

afterAll(() => {
    mock.restore();
});