const main = require("../main");
const given = require("./given");
const AWS = require('aws-sdk-mock');
const validation = require('../validation');
jest.mock('../validation');

describe("We log structured events for garbage payloads", () => {
    const spyLog = jest.spyOn( console, 'log' );
    const spyJsonStringify = jest.spyOn( JSON, 'stringify' );

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           callback(null, {}); 
        });
        spyLog.mockReset();
        spyJsonStringify.mockReset();
        jest.clearAllMocks();
        await main.handler(given.aBadRecord);
    });

    test("it should log a structured event", async () => {
        expect(spyLog).toHaveBeenCalledWith(JSON.stringify(expect.any(String)));
    });

    test("it should json stringify the structured event", async () => {
        expect(spyJsonStringify).toHaveBeenCalledWith({
            correlation_id: "101",
            event_type: "process",
            time_created: expect.any(String),
            event: {
                source: "Unknown",
                destination: "Unknown",
                process_status: "ERROR",
                translation: {
                    time_taken: expect.any(Number)
                }
            }
        });
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });
});

describe("We log structured events for invalid payloads", async () => {
    const spyLog = jest.spyOn( console, 'log' );
    const spyJsonStringify = jest.spyOn( JSON, 'stringify' );

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           callback(null, {}); 
        });
        spyLog.mockReset();
        spyJsonStringify.mockReset();
        const event = { "Records": [given.invalidNhsNoRecord]};
        validation.isNhsNoValid = async function() {return false;};
        await main.handler(event);
    });

    test("it should log a structured event", async () => {
        expect(spyLog).toHaveBeenCalledWith(JSON.stringify(expect.any(String)));
    });

    test("it should json stringify the structured event", async () => {
        expect(spyJsonStringify).toHaveBeenCalledWith({
            correlation_id: "101",
            event_type: "process",
            time_created: expect.any(String),
            event: {
                source: "Test_Source",
                destination: "Test_Destination",
                process_status: "FAILED",
                translation: {
                    time_taken: expect.any(Number)
                }
            }
        });
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
        jest.clearAllMocks();
    });
});

describe("We log structured events for translated payloads", () => {
    const spyLog = jest.spyOn( console, 'log' );
    const spyJsonStringify = jest.spyOn( JSON, 'stringify' );

    beforeAll(async () => {
        AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
           callback(null, {}); 
        });
        spyLog.mockReset();
        const event = {"Records": [given.aNewRecord]};
        validation.isNhsNoValid = async function() {return true;};
        await main.handler(event);
    });

    test("it should log a structured event", async () => {
        expect(spyLog).toHaveBeenCalledWith(JSON.stringify(expect.any(String)));
    });

    test("it should json stringify the structured event", async () => {
        expect(spyJsonStringify).toHaveBeenCalledWith({
            correlation_id: "101",
            event_type: "process",
            time_created: expect.any(String),
            event: {
                source: "Test_Source",
                destination: "Test_Destination",
                process_status: "COMPLETED",
                translation: {
                    time_taken: expect.any(Number)
                }
            }
        });
    });

    afterAll(() => {
        AWS.restore('DynamoDB.DocumentClient');
        jest.clearAllMocks();
    });
});