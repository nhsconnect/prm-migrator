const retrieveStatus = require("./main");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

class DynamoDBMock {
    constructor() {
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
                        console.log("LOGING PARAMS", params)
                        if (params.Key.PROCESS_ID === '1') {
                            resolve(
                                {
                                    Item: {
                                        PROCESS_STATUS: "ACCEPTED"
                                    }
                                })
                        } else {
                            resolve(
                                {
                                    Item: {
                                        PROCESS_STATUS: "PROCESSING"
                                    }
                                })
                        }
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

xdescribe("COMPLETED responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a COMPLETED response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock());
        expect(result.currentStatus).toBe("COMPLETED");
    });
});

xdescribe("FAILED responses", () => {
    test("That when asked for a status given a UUID, if present, it generates a FAILED response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock());
        expect(result.currentStatus).toBe("FAILED");
    });
});

xdescribe("NOT FOUND", () => {
    test("That when asked for a status given a UUID, if present, it generates a NOT FOUND response", async () => {
        const result = await retrieveStatus.main(new DynamoDBMock());
        expect(result.currentStatus).toBe("NOT FOUND");
    });
});

