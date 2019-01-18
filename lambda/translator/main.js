const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const helper = require('./helper');

exports.handler = (event, context) => {
    let nhsNumber = event.dynamodb.NewImage.PROCESS_PAYLOAD.S;
    let uuid = event.dynamodb.Keys.PROCESS_ID.S;

    let client = new AWS.DynamoDB.DocumentClient();

    client.update(helper.changeStatusTo('PROCESSING', uuid));

    client.update(helper.changeStatusTo('COMPLETED', uuid));

    return {
        statusCode: 200,
        body: `<Patient><identifier><value>${nhsNumber}</value></identifier></Patient>`,
        isBase64Encoded: false
    };
};