const Url = require('url');
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");
const sleep = m => new Promise(r => setTimeout(r, m));
const given = require('./given');

const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

let testUuid;

test("As a supplier, I can send my message and see that it has been accepted", async () => {
    const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;

    const options = {
        method: 'POST',
        uri: url,
        body: given.tpp_sample_encodedXml,
        resolveWithFullResponse: true
    };

    const response = await request.post(options);

    expect(response.statusCode).toBe(200);
    const {uuid, status} = JSON.parse(response.body);
    testUuid = uuid;

    console.log(testUuid);
    expect(uuid).toBeDefined();
    expect(status).toBe("ACCEPTED");
});

test.skip("As a supplier, I can see my message has been accepted", async () => {
    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${testUuid}`;

    var options = {
        method: 'GET',
        uri: statusUrl,
        resolveWithFullResponse: true
    };

    const response = await request.get(options);

    const {status} = JSON.parse(response.body);
    expect(status).toBe("ACCEPTED");
});

test.skip("As a supplier, I can see my message is being processed", async () => {
    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${testUuid}`;

    var options = {
        method: 'GET',
        uri: statusUrl,
        resolveWithFullResponse: true
    };

    const response = await request.get(options);

    const {status} = JSON.parse(response.body);
    expect(status).toBe("PROCESSING");
});


test.skip("As a supplier, I can see my message has been completed", async () => {
    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${testUuid}`;

    var options = {
        method: 'GET',
        uri: statusUrl,
        resolveWithFullResponse: true
    };

    const response = await request.get(options);

    const {status} = JSON.parse(response.body);
    expect(status).toBe("COMPLETED");
});

test("As a supplier, I can retrieve my processed ehrExtract in the form of an encoded xml payload", async () => {
    const retrieveUrl = `${PRM_URL.origin}${PRM_URL.pathname}/retrieve/${testUuid}`;
    const retrieveResponse = await request.post(retrieveUrl, {
        resolveWithFullResponse: true
    });
    expect(retrieveResponse.body).toBe(given.processed_ehr_extract_encodedXml);
});