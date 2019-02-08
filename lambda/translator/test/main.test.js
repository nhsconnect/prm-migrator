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

    xtest("it should update the status to PROCESSING", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('PROCESSING', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    xtest("it should update status to COMPLETED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    xtest("it should update status to FAILED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('FAILED', '101');

        await main.handler(given.invalidNhsNoRecords);
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});

xdescribe("Broadly speaking, we integrate our logic with AWS proxy", () => {

    var updateSpy = sinon.spy();

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
        await main.handler(given.twoNewRecords);
    });


    test("We update the database correctly if the translation was successful", async () => {

        expect(await main.handler(given.oneFailingOneSuccessfulRecord)).toEqual(
            [{
                status: "COMPLETED",
                correlationId: "101",
                translation: {
                    patient: {
                        identifier: {
                            value: "3474710087"
                        }
                    }
                },
                original: given.oneFailingOneSuccessfulRecord.Records[0]
            },
            {
                status: "FAILED",
                correlationId: "102",
                reason: {
                    code: "PATIENT_VALIDATION_10001",
                    message: "Given NHS Number could not be found on PDS"
                },
                original: given.oneFailingOneSuccessfulRecord.Records[1]
            }]
        );

        const expectedParams1 = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        const expectedParams2 = dbQueryHelper.changeStatusTo('FAILED', '102');

        // check our mock database
        expect(updateSpy.calledWith(expectedParams1)).toBeTruthy();
        expect(updateSpy.calledWith(expectedParams2)).toBeTruthy();
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});

xtest("we can translate a group of patients with invalid NHS numbers", async () => {
    var updateSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);

    await main.handler(given.invalidNhsNoRecords);
    var expectedParams = dbQueryHelper.changeStatusTo('FAILED', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();

    var expectedParams2 = dbQueryHelper.changeStatusTo('FAILED', '102');
    expect(updateSpy.calledWith(expectedParams2)).toBeTruthy();

});


xdescribe("Calling lambda", () => {
    let result;
    var updateSpy = sinon.spy();

    beforeAll(() => {
        AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
        let event = given.twoNewRecords;
        result = main.handler(event);
    });

    test("it should translate the record if its given NHS number is valid", () => {
        let event = given.twoNewRecords;
        result = main.handler(event);

        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should not translate the record if its given NHS number is invalid", () => {
        let event = given.invalidNhsNoRecords;
        result = main.handler(event);

        var expectedParams = dbQueryHelper.changeStatusTo('FAILED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should update status of the first record to COMPLETED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should update status of the second record to COMPLETED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '102');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("returns a successful response", async () => {
        expect(result.statusCode).toBe(200);
    });

    test("returns the expected body", async () => {
        expect(result.body).toBe('');
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});
