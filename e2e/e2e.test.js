const Url = require("url");
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");
const sleep = m => new Promise(r => setTimeout(r, m));

const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

let testUuid;
const testPayload = "foo";

test("As a supplier, I can send my message and see that it has been accepted", async () => {
    const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;

    var options = {
        method: 'POST',
        uri: url,
        body: JSON.stringify({
            payload: testPayload
        }),
        resolveWithFullResponse: true
    };

    const response = await request.post(options);

    expect(response.statusCode).toBe(200);
    const {uuid, status, payload} = JSON.parse(response.body);
    testUuid = uuid;
    expect(uuid).toBeDefined();
    expect(status).toBe("ACCEPTED");
    expect(payload).toBe('foo');
});

test("As a supplier, I can see my message has been accepted", async () => {
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

test("As a supplier, I can see my message is being processed", async () => {
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


test("As a supplier, I can see my message has been completed", async () => {
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

test("As a supplier, I can retrieve my processed ehrExtract in form of a payload", async () => {
    const retrieveUrl = `${PRM_URL.origin}${PRM_URL.pathname}/retrieve/${testUuid}`;
    const retrieveResponse = await request.post(retrieveUrl, {
        resolveWithFullResponse: true
    });
    
    console.log(retrieveResponse.body);
    expect(retrieveResponse.body).toBe(`{"payload":"${testPayload}"}`);
});