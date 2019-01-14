const retrieveStatus = require("./main");
var AWS = require('aws-sdk-mock');

class DynamoDBMock {
    constructor() {
        this.mockTable = {
            '1': {PROCESS_STATUS: 'ACCEPTED'},
            '2': {PROCESS_STATUS: 'PROCESSING'},
            '3': {PROCESS_STATUS: 'COMPLETED'},
            '4': {PROCESS_STATUS: 'FAILED'},
            '6': {PROCESS_STATUS: 'ACCEPTED'},
            '7': {PROCESS_STATUS: 'PROCESSING'}
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
                            tableEntry = {Item: {...this.mockTable[uuid]}}
                            resolve(tableEntry)
                        }
                        reject({})
                    }, 100)
                })
            }
        }
    }

    update(params) {
        return {
            promise: () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const uuid = params.Key.PROCESS_ID;
                        if (this.mockTable[uuid].PROCESS_STATUS === "PROCESSING") {
                            this.mockTable[uuid].PROCESS_STATUS = "COMPLETED"
                            resolve()
                        }
                        if (this.mockTable[uuid].PROCESS_STATUS === "ACCEPTED") {
                            this.mockTable[uuid].PROCESS_STATUS = "PROCESSING"
                            resolve()
                        }
                        reject({})
                    }, 100)
                })
            }
        }
    }
}

describe("ACCEPTED responses", () => {
    test("That when asked for a status given a UUID, if present, it generates an ACCEPTED response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), "1");
        expect(result.currentStatus).toBe("ACCEPTED");
    });
});

describe("PROCESSING responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a PROCESSING response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), "2");
        expect(result.currentStatus).toBe("PROCESSING");
    });
});

describe("COMPLETED responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a COMPLETED response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), '3');
        expect(result.currentStatus).toBe("COMPLETED");
    });
});

describe("FAILED responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a FAILED response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), '4');
        expect(result.currentStatus).toBe("FAILED");
    });
});

describe("NOT FOUND responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a NOT FOUND response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), '5');
        expect(result.currentStatus).toBe("NOT FOUND");
    });
});

describe("ACCEPTED", () => {
    test("That when asked for a status given a UUID, and the message is just in the queue, it generates a ACCEPTED response", async () => {
        const dbMock = new DynamoDBMock()
        const result = await retrieveStatus.main(dbMock, "6");
        expect(result.currentStatus).toBe("ACCEPTED");
    });
});

describe("ACCEPTED to PROCESSING", () => {
    test("That when asked for a status given a UUID, ACCEPTED can be changed to PROCESSING", async () => {
        const dbMock = new DynamoDBMock()
        const result = await retrieveStatus.main(dbMock, "6");
        expect(result.currentStatus).toBe("ACCEPTED");
        const result2 = await retrieveStatus.main(dbMock, "6");
        expect(result2.currentStatus).toBe("PROCESSING");
    });
});

describe("PROCESSING to COMPLETED", () => {
    test("That when asked for a status given a UUID, PROCESSING can be changed to COMPLETED", async () => {
        const dbMock = new DynamoDBMock()
        const result = await retrieveStatus.main(dbMock, "7");
        expect(result.currentStatus).toBe("PROCESSING");
        const result2 = await retrieveStatus.main(dbMock, "7");
        expect(result2.currentStatus).toBe("COMPLETED");
    });
});

describe("Building a handler", () => {
    test("That when asked for a status given a UUID, PROCESSING can be changed to COMPLETED", async () => {
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback){
            callback(null, {Item: {PROCESS_STATUS: 'PROCESSING'}});
          });
        AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback){
            callback(null, {});
          });
        let event = {pathParameters: {uuid: "7"}};
        const result = await retrieveStatus.handler(event); //?
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe('{"status":"PROCESSING"}');

        AWS.remock('DynamoDB.DocumentClient', 'get', function (params, callback){
            callback(null, {Item: {PROCESS_STATUS: 'COMPLETED'}});
          });
        const result2 = await retrieveStatus.handler(event);
        expect(result2.body).toBe('{"status":"COMPLETED"}');

        AWS.restore('DynamoDB');
    });
});

