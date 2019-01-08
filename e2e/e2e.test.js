const Url = require("url");
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");
const sleep = m => new Promise(r => setTimeout(r, m));

const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

test("As a supplier, I can see my message has been accepted", async () => {
    const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;
    const testPayload = "foo";

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
    expect(uuid).toBeDefined();
    expect(status).toBe("ACCEPTED");
    expect(payload).toBe('foo');
});

test("As a supplier, I can see my message is being processed", async () => {
    const sendUrl = `${PRM_URL.origin}${PRM_URL.pathname}/send`;

    const testPayload = "foo";

    var options = {
        method: 'POST',
        uri: sendUrl,
        body: JSON.stringify({
            payload: testPayload
        }),
        resolveWithFullResponse: true
    };

    const sendResponse = await request.post(options);

    const {uuid} = JSON.parse(sendResponse.body);
    await sleep(3000);

    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${uuid}`;
    const statusResponse = await request.get(statusUrl, {
        resolveWithFullResponse: true
    });
    const {status} = JSON.parse(statusResponse.body);
    expect(status).toBe("PROCESSING");
});

test.skip("As a supplier, I can retrieve my processed ehrExtract in form of a payload", async () => {
    const sendUrl = `${PRM_URL.origin}${PRM_URL.pathname}/send`;
    const sendResponse = await request.post(sendUrl, {
        resolveWithFullResponse: true
    });
    const {uuid} = JSON.parse(sendResponse.body);
    await sleep(1000);

    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${uuid}`;
    const statusResponse = await request.post(statusUrl, {
        resolveWithFullResponse: true
    });

    const retrieveUrl = `${PRM_URL.origin}${PRM_URL.pathname}/retrieve/${uuid}`;
    const retrieveResponse = await request.post(retrieveUrl, {
        resolveWithFullResponse: true
    });

    const {processedEhrExtract} = JSON.parse(retrieveResponse.body);
    expect(processedEhrExtract).toBeDefined();
});