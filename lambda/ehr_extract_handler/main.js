const uuid = require("uuid/v4");
const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-2"});

const MigrationEventStates = {
    ACCEPTED: "ACCEPTED",
    ERROR: "ERROR",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
};

class MigrationEventStateMachine {
    constructor(client) {
        this.uuid = undefined;
        this.status = MigrationEventStates.FAILED;
        this.client = client; 
    }

    async accept(ehrExtract) {
        if (this.uuid !== undefined) {
            throw new Error(
                `INVALID STATE TRANSITION: Cannot move from ${this.status} to ${
                    MigrationEventStates.ACCEPTED
                    }`
            );
        }
        try {
            const expectedID = uuid();
            const expectedState = MigrationEventStates.ACCEPTED;
            const result = await this.client.put({
                PROCESS_ID: expectedID,
                PROCESS_STATUS: expectedState,
                PROCESS_PAYLOAD: ehrExtract 
            });
            this.uuid = result.PROCESS_ID;
            this.status = result.PROCESS_STATUS;
            this.payload = result.PROCESS_PAYLOAD;
        } catch (err) {
            console.log(err);
        }

        return this;
    }

    get currentStatus() {
        return this.status;
    }

    get correlationId() {
        return this.uuid;
    }
}

class ProcessStatusWrapper {
    constructor() {
        this.dbClient = new AWS.DynamoDB.DocumentClient();
    }

    async put(item) {
        await this.dbClient
            .put({
                TableName: "PROCESS_STORAGE",
                Item: item,
                ReturnValues: "ALL_OLD"
            })
            .promise();
        return item;
    }
}

exports.ProcessStatusWrapper = ProcessStatusWrapper;

exports.main = async function (ehrExtract) {
    const event = new MigrationEventStateMachine(
        new ProcessStatusWrapper()
    );
    const result = await event.accept(ehrExtract);
    return result;
};

exports.handler = async (event, context) => {
    // handle AWS specific stuff here

    const {payload} = JSON.parse(event.body);

    // call the business logic
    const result = await module.exports.main(payload);
    // handle converting back to AWS
    return {
        statusCode: 200,
        body: JSON.stringify({
            uuid: result.correlationId,
            status: result.currentStatus,
            payload: result.payload
        }),
        isBase64Encoded: false
    };
};
