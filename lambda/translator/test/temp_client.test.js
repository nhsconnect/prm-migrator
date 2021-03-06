const pds_client = require('../pds_client');
const given = require('./given');
const AWS = require('aws-sdk-mock');
const request = require('request-promise-native');
jest.mock('request-promise-native');

describe("PDS calls work", () => {
    
    beforeAll(() => {
        process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME = "abc"
        AWS.mock('SSM', 'getParameter', { Parameter: { Value: "1234ABCD"}});
    });

    test('we should be able to get an adequate response when validating a valid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        request.post = async function() { return given.generateValidPdsGetNHSNumberResponseFor(nhsNoToVerify); };
    
        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(true);
    });

    test('we should be able to get an adequate response when validating a invalid NHS number', async () => {
        const nhsNoToVerify = "9999345201";
        request.post = async function() { return given.generateInvalidPdsGetNHSNumberResponse(); };

        expect(await pds_client.verifyNhsNumber(nhsNoToVerify)).toBe(false);
    });

    afterAll(() => {
        jest.clearAllMocks();
        AWS.restore('SSM');
    });
});
