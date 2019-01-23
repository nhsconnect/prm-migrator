const retrieveProcessed = require("./main");
const AWS = require('aws-sdk-mock');
const given = require('./given');

class DynamoDBMock {
    constructor() {
        this.mockTable = {
            '1': { PROCESS_STATUS: 'ACCEPTED', PROCESS_PAYLOAD: 'bar' }
        }
    }

    get(params) {
        return {
            promise: () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const uuid = params.Key.PROCESS_ID;
                        let tableEntry;
                        if (this.mockTable[uuid]) {
                            tableEntry = { Item: { ...this.mockTable[uuid] } }
                            resolve(tableEntry)
                        }
                        reject({})
                    }, 100)
                })
            }
        }
    }
}

describe("Error when entry doesn't exist", () => {
    test("That when asked for a response given a non-existing UUID, it throws an error", async () => {
        const result = await retrieveProcessed.main(new DynamoDBMock(), "-1");
        expect(result).toBe('Entry not found');
    });
});

describe("Build handler", () => {
    test("That when asked for a response given a UUID, if present, it returns a payload", async () => {
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(null, { Item: { PROCESS_PAYLOAD: given.processed_ehr_extract_json } });
        });
        let event = { pathParameters: { uuid: "7" } };
        const result = await retrieveProcessed.handler(event);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(given.processed_ehr_extract_encodedXml);
    });
});