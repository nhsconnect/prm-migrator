const Url = require('url');
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");
const sleep = m => new Promise(r => setTimeout(r, m));
require('jest-matcher-one-of');
const given = require('./given');

describe("As a supplier, I can successfully translate a GP2GP message", async () => {

    const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

    describe("I can successfully send a payload", async () => {

        let postPayloadResponse;
        let testUuid;

        beforeAll(async () => {
            const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;

            const options = {
                method: 'POST',
                uri: url,
                body: given.tpp_sample_encodedXml,
                resolveWithFullResponse: true
            };

            postPayloadResponse = await request.post(options);
        });

        it("it should return an ok response", () => {
            expect(postPayloadResponse.statusCode).toBe(200);
        });

        it("it should return a uuid", () => {
            const { uuid } = JSON.parse(postPayloadResponse.body);
            testUuid = uuid;
            expect(testUuid).toBeDefined();    
        });

        it("it should return an ACCEPTED status", () => {
            const { status } = JSON.parse(postPayloadResponse.body);
            expect(status).toBe("ACCEPTED");
        });

        describe("I can see the payload has been successfully processed", async () => {

            beforeAll(async () => {
                await sleep(3000);
            });

            describe("I can retrieve the processed payload", async () => {

                let retrievePayloadResponse;

                beforeAll(async () => {
                    const retrieveUrl = `${PRM_URL.origin}${PRM_URL.pathname}/retrieve/${testUuid}`;
                    retrievePayloadResponse = await request.post(retrieveUrl, {
                        resolveWithFullResponse: true
                    });
                });

                it("it should return the processed payload", () => {
                    expect(retrievePayloadResponse.body).toBe(given.processed_ehr_extract_encodedXml);
                });
            })
        })
    })
});