const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});

class MigrationEventStateMachine {
    constructor(client) {
        this.uuid = undefined;
        this.status = undefined;
        this.client = client;
    }

    async get(uuid) {
        try {
            let result = await this.client.get(uuid);
            this.uuid = uuid;
            this.status = result.Item.PROCESS_STATUS;

            await this.transitionState(result, uuid, "PROCESSING", "COMPLETED");
            await this.transitionState(result, uuid, "ACCEPTED", "PROCESSING");
        } catch (err) {
            this.status = 'NOT FOUND';
        }

        return this;
    }

    async transitionState(result, key, from, to) {
        if (result.Item.PROCESS_STATUS === from) {
            await this.client.update(key, to);
        }
    }

    get currentStatus() {
        return this.status;
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
        
        return result;
    }

    async update(uuid, status) {
        return await this.dbClient.update({
            TableName: "PROCESS_STORAGE",
            Key: {
                "PROCESS_ID": uuid
            },
            UpdateExpression: "set PROCESS_STATUS = :p",
            ExpressionAttributeValues: {
                ":p": status,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
    }
}

exports.handler = async (event, context) => {
    const uuid = event.pathParameters.uuid;
    const client = new AWS.DynamoDB.DocumentClient();
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

