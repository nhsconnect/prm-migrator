const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
const client = new AWS.DynamoDB.DocumentClient();

class MigrationEventStateMachine {
    constructor(client) {
        this.uuid = undefined;
        this.status = undefined;
        this.client = client;
    }

    async get(uuid) {
        try {
            let result = await this.client.get(uuid)
            this.uuid = uuid;
            this.status = result.Item.PROCESS_STATUS;
        } catch (err) {
            this.status = 'NOT FOUND';
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

exports.main = async function (dbClient, uuid) {
    var event = new MigrationEventStateMachine(new ProcessStatusWrapper(dbClient));
    return event.get(uuid);
};

class ProcessStatusWrapper {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async get(key) {
        let result = await this.dbClient
            .get({
                TableName: "PROCESS_STORAGE",
                Key: {
                    PROCESS_ID: key
                }
            })
            .promise();

        if (result.Item.PROCESS_STATUS === "PROCESSING") {
            const params = {
                TableName: "PROCESS_STORAGE",
                Key: {
                    "PROCESS_ID": key
                },
                UpdateExpression: "set PROCESS_STATUS = :p",
                ExpressionAttributeValues: {
                    ":p": "COMPLETED",
                },
                ReturnValues: "UPDATED_NEW"
            };
            await this.dbClient.update(params).promise();
        }

        if (result.Item.PROCESS_STATUS === "ACCEPTED") {
            const params = {
                TableName: "PROCESS_STORAGE",
                Key: {
                    "PROCESS_ID": key
                },
                UpdateExpression: "set PROCESS_STATUS = :p",
                ExpressionAttributeValues: {
                    ":p": "PROCESSING",
                },
                ReturnValues: "UPDATED_NEW"
            };
            await this.dbClient.update(params).promise();
        }

        return result;
    }
}

exports.handler = async (event, context) => {
    const uuid = event.pathParameters.uuid;
    // call the business logic
    const result = await module.exports.main(client, uuid);
    // handle converting back to AWS
    return {
        statusCode: 200,
        body: JSON.stringify({
            uuid: result.correlationId,
            status: result.currentStatus,
        }),
        isBase64Encoded: false
    };
};

