const retrieveProcessed = require("./main");

class DynamoDBMock {
    constructor() {
        this.mockTable = {
            '1': {PROCESS_STATUS: 'ACCEPTED', PROCESS_PAYLOAD: 'bar'}
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
}

describe("Return payload", () => {
    test("That when asked for a response given a UUID, if present, it returns a payload", async () => {
        const result = await retrieveProcessed.main(new DynamoDBMock(), "1");
        expect(result.currentPayload).toBe("bar");
    });
});

describe("Error when entry doesn't exist", () => {
    test("That when asked for a response given a non-existing UUID, it throws an error", async () => {
        const result = await retrieveProcessed.main(new DynamoDBMock(), "-1"); //?
        expect(result).toBe('Entry not found');
    });
});