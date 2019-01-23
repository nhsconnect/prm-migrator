const translator = require("../main");
const given = require("./given");
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const dbQueryHelper = require('../dbQueryHelper');


describe('Broadly speaking, translations work', () => {
    test("we can translate an individual patient", () => {
        expect(translator.main(given.aNewRecord)).toEqual({
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
        expect(translator.main(given.invalidNhsNoRecord)).toEqual({
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
        expect(translator.main(given.invalidNhsNoRecord2)).toEqual({
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

describe("Broadly speaking, we integrate our logic with AWS DynamoDB", () => {
    var updateSpy = sinon.spy();

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
        await translator.handler(given.twoNewRecords);
    });

    test("it should update the status to PROCESSING", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('PROCESSING', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should update status to COMPLETED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should update status to FAILED", async () => {
        var expectedParams = dbQueryHelper.changeStatusTo('FAILED', '101');

        await translator.handler(given.invalidNhsNoRecords);
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});

describe("Broadly speaking, we integrate our logic with AWS proxy", () => {
    test("we can send back an AWS response with the right status code if the translation was successful", async () => {
        expect(await translator.handler(given.twoNewRecords)).toEqual({
            statusCode: 200,
            body: '',
            isBase64Encoded: false
        });
    });

    test("we can send back an AWS response with the right status code if the translation was unsuccessful", async () => {
        expect(await translator.handler(given.invalidNhsNoRecords)).toEqual({
            statusCode: 404,
            body: '',
            isBase64Encoded: false
        });
    });


});

    // test("we can translate an individual patient", async () => {
    //     expect(await translator.main(given.twoNewRecords)).toEqual(
    //         {
    //             status: "COMPLETED",
    //             correlationId: "101",
    //             translation: {
    //                 patient: {
    //                     identifier: {
    //                         value: "3474710087"
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             status: "FAILED",
    //             correlationId: "101",
    //             translation: {
    //                 patient: {
    //                     identifier: {
    //                         value: "1234567"
    //                     }
    //                 }
    //             }
    //         }
    //     )
    // });


xdescribe("Calling lambda", () => {
    let result;
    var updateSpy = sinon.spy();

    beforeAll(() => {
        AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
        let event = given.twoNewRecords;
        result = translator.handler(event);
    });

    test("it should translate the record if its given NHS number is valid", () => {
        let event = given.twoNewRecords;
        result = translator.handler(event);

        var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
        expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
    });

    test("it should not translate the record if its given NHS number is invalid", () => {
        let event = given.invalidNhsNoRecords;
        result = translator.handler(event);

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
