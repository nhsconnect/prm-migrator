const AWS = require("aws-sdk");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const convert = require('xml-js');

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
    const client = new ProcessStatusWrapper(dbClient);
    try {
        const result = await client.get(uuid);

        let extractXml = convert.json2xml(result.Item.PROCESS_PAYLOAD, { compact: true, spaces: 4 });
        let encodedXml = entities.encode(extractXml);
        console.log('Retrieve Processed EHR Extract: encoded XML', encodedXml);
        console.log('Retrieve Processed EHR Extract: extract XML', extractXml)
        return encodedXml;
    } catch (err) {
        return "Entry not found";
    }
};

exports.handler = async function (event) {
    const uuid = event.pathParameters.uuid;
    const client = new AWS.DynamoDB.DocumentClient();

    const result = await module.exports.main(client, uuid);
    return {
        statusCode: 200,
        body: result,
        isBase64Encoded: false
    };
}
