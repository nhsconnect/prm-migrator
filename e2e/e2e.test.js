const Url = require('url');
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");
const sleep = m => new Promise(r => setTimeout(r, m));
require('jest-matcher-one-of');
const given = require('./given');
const prefix = "«««E2Etest««« ";

const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

let testUuid;

test("As a supplier, I can successfully translate a GP2GP message", async () => {
    // send 
    const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;
    console.log(`${prefix}${url}`);

    const options = {
        method: 'POST',
        uri: url,
        body: given.tpp_sample_encodedXml,
        resolveWithFullResponse: true
    };

    const response = await request.post(options);

    expect(response.statusCode).toBe(200);
    const { uuid, status } = JSON.parse(response.body);
    testUuid = uuid;

    console.log(`${prefix}${testUuid}`);
    expect(uuid).toBeDefined();
    expect(status).toBe("ACCEPTED");

    /*
    //status
    const statusUrl = `${PRM_URL.origin}${PRM_URL.pathname}/status/${testUuid}`;
    console.log(`${prefix}${statusUrl}`);

    var options2 = {
        method: 'GET',
        uri: statusUrl,
        resolveWithFullResponse: true
    };

    let returnedStatus;

    do {
        console.log(`${prefix}_start_doing`);
        const response = await request.get(options2);
        const body = JSON.parse(response.body);
        returnedStatus = body.status;
        console.log(`${prefix}${returnedStatus}`);
        expect(returnedStatus).toBeOneOf(["PROCESSING", "ACCEPTED", "COMPLETED"]);
    } while (returnedStatus !== "COMPLETED")

    // retrieve 
    const retrieveUrl = `${PRM_URL.origin}${PRM_URL.pathname}/retrieve/${testUuid}`;
    console.log(`${prefix}${retrieveUrl}`);
    const retrieveResponse = await request.post(retrieveUrl, {
        resolveWithFullResponse: true
    });
    console.log(`${prefix}${retrieveResponse.body}`);
    expect(retrieveResponse.body).toBe(given.processed_ehr_extract_encodedXml);
    */
});



