const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

const MigrationEventStates = {
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
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
            console.log(err);
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

    async delete(key) {
        return await this.dbClient
            .delete({
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
