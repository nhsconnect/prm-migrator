const uuid = require("uuid/v4");
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const Entities = require('html-entities').XmlEntities;
let convert = require('xml-js');

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
        console.log("EhrExtractHandler --> this is going in DB as JSON", ehrExtract)
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
            this.status = MigrationEventStates.ERROR;
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

exports.handler = async (event) => {

    const entities = new Entities();
    let xml = entities.decode(event.body);
    console.log("EhrExtractHandler --> this is our decoded event.body in xml ", xml);
    let ehrExtract = convert.xml2json(xml, {compact: true, spaces: 4}); 
    console.log("EhrExtractHandler --> this is our JSON Extract", ehrExtract);

    const result = await module.exports.main(ehrExtract);

    return {
        statusCode: 200,
        body: JSON.stringify({
            uuid: result.correlationId,
            status: result.currentStatus
        }),
        isBase64Encoded: false
    };
};
