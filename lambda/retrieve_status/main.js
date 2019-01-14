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
        } catch (err) {
            this.status = 'NOT FOUND';
        }

        return this;
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

    async transitionState(result, key, from, to) {
        if (result.Item.PROCESS_STATUS === from) {
            const params = {
                TableName: "PROCESS_STORAGE",
                Key: {
                    "PROCESS_ID": key
                },
                UpdateExpression: "set PROCESS_STATUS = :p",
                ExpressionAttributeValues: {
                    ":p": to,
                },
                ReturnValues: "UPDATED_NEW"
            };
            await this.dbClient.update(params).promise();
        }
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
        
        await this.transitionState(result, key, "PROCESSING", "COMPLETED");
        await this.transitionState(result, key, "ACCEPTED", "PROCESSING");

        return result;
    }
}

exports.handler = async (event, context) => {
    const uuid = event.pathParameters.uuid;
    const client = new AWS.DynamoDB.DocumentClient(); //?
    // call the business logic
    const result = await module.exports.main(client, uuid); //?
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

