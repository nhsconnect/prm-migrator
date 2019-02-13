const main = require("../main");
const given = require("./given");
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const dbQueryHelper = require('../dbQueryHelper');

describe('Broadly speaking, translations work', () => {
    test("we can translate an individual patient", () => {
        expect(main.main(given.aNewRecord)).toEqual({
            status: "COMPLETED",
            correlationId: "101",
            translation: {
                patient: {
                    identifier: {
                        value: "3474710087"
                    }
                }
            },
            original: given.aNewRecord,
        })
    });
    test("that when an invalid patient is sent, it causes a failure", () => {
        expect(main.main(given.invalidNhsNoRecord)).toEqual({
            status: "FAILED",
            correlationId: "101",
            reason: {
                code: "PATIENT_VALIDATION_10001",
                message: "Given NHS Number could not be found on PDS"
            },
            original: given.invalidNhsNoRecord,
        })
    });
    test("that when an invalid patient is sent, it causes a failure again", () => {
        expect(main.main(given.invalidNhsNoRecord2)).toEqual({
            status: "FAILED",
            correlationId: "101",
            reason: {
                code: "PATIENT_VALIDATION_10001",
                message: "Given NHS Number could not be found on PDS"
            },
            original: given.invalidNhsNoRecord2,
        })
    });
});

describe("When garbage is sent in,", () => {
    let updateCallCount = 0;
    let result;

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           updateCallCount++;
           callback(null, {}); 
        });
       result = await main.handler(given.aBadRecord);
    });

    test("it should not return an error", async () => {
      expect(result).toEqual([]);
    });

    test("it should make two calls to update", async () => {
        expect(updateCallCount).toBe(2);
      });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
  
});

describe("When invalid NHS number is sent in,", () => {
    let updateCallCount = 0;
    let result;

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           updateCallCount++;
           callback(null, {}); 
        });
       result = await main.handler({"Records": [given.invalidNhsNoRecord]});
    });

    test("it should not return an error", async () => {
      expect(result).toEqual([]);
    });

    test("it should make two calls to update", async () => {
        expect(updateCallCount).toBe(2);
      });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
  
});

describe("Broadly speaking, we integrate our logic with AWS DynamoDB and we ignore MODIFY events", () => {
    let updateCallCount = 0;

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           updateCallCount++;
           callback(null, {}); 
        });
        await main.handler(given.twoModifiedRecords);
    });

    test("it should not update the status at all", async () => {
        expect(updateCallCount).toBe(0);
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});

describe("Broadly speaking, we integrate our logic with AWS DynamoDB for INSERT events only", () => {
    let updateCallCount = 0;

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           updateCallCount++;
           callback(null, {}); 
        });
        await main.handler(given.twoNewRecords);
    });

    test("it should update the status 6 times", async () => {
        expect(updateCallCount).toBe(6);
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});
