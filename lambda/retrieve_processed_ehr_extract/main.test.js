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

describe("ACCEPTED responses", () => {
    test("That when asked for a resonse given a UUID, if present, it generates an ACCEPTED response", async () => {
        const result = await retrieveProcessed.main(new DynamoDBMock(), "1");
        expect(result.currentPayload).toBe("bar");
    });
});

