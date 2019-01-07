const retrieveStatus = require("./main");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

class DynamoDBMock {
    constructor() {
        this.mockTable = {
            '1': {PROCESS_STATUS: 'ACCEPTED'},
            '2': {PROCESS_STATUS: 'PROCESSING'},
            '3': {PROCESS_STATUS: 'COMPLETED'},
            '4': {PROCESS_STATUS: 'FAILED'}
        }
    }

    put(params) {
        return {
            promise: () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 100);
                });
            }
        };
    }

    get(params) {
        return {
            promise: () => {

                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const uuid = params.Key.PROCESS_ID;
                        let tableEntry
                        if (this.mockTable[uuid]) {
                            tableEntry = {Item: this.mockTable[uuid]}
                            resolve(tableEntry)
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

describe("NOT FOUND", () => {
    test("That when asked for a status given a UUID, if present, it generates a NOT FOUND response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock(), '5');
        expect(result.currentStatus).toBe("NOT FOUND");
    });
});

