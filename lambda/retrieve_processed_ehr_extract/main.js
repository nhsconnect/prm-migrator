const AWS = require("aws-sdk");

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
        this.status = MigrationEventStates.REJECTED;
        this.client = client;
    }

    async get(uuid) {
        try {
            const result = await this.client.get(uuid);
            this.uuid = uuid;
            this.status = result.Item.PROCESS_STATUS;
            this.payload = result.Item.PROCESS_PAYLOAD;
        } catch (err) {
            return "Entry not found";
        }

        return this;
    }
    
    get currentPayload() {
        return this.payload;
    }
}

class ProcessStatusWrapper {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async get(key) {
        return await this.dbClient
            .get({
                TableName: "PROCESS_STORAGE",
                Key: {
                    PROCESS_ID: key
                }
            })
            .promise();
    }
}

exports.main = async function (dbClient, uuid) {
    const event = new MigrationEventStateMachine(
        new ProcessStatusWrapper(dbClient)
    );
    const result = await event.get(uuid);
    return result;
};

exports.handler = async function (event) {
    const uuid = event.pathParameters.uuid;
    const client = new AWS.DynamoDB.DocumentClient();
    const result = await module.exports.main(client, uuid);
    return {
        statusCode: 200,
        body: result.currentPayload,
        isBase64Encoded: false
    };
}
