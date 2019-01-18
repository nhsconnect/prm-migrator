const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const dbQueryHelper = require('./dbQueryHelper');
const EasyXml = require('easyxml');

exports.handler = (event, context) => {
    let nhsNumber = event.dynamodb.NewImage.PROCESS_PAYLOAD.S;
    let uuid = event.dynamodb.Keys.PROCESS_ID.S;

    let client = new AWS.DynamoDB.DocumentClient();

    client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid));

    let payload = {
        identifier: {
            value: nhsNumber
        }
    };

    var patientPayloadXmlOptions = {
        rootElement: 'Patient',
        manifest: true,
    };
    let serializer = new EasyXml(patientPayloadXmlOptions);
    let payloadXml = serializer.render(payload);

    client.update(dbQueryHelper.changePayloadTo(payloadXml, uuid));
    client.update(dbQueryHelper.changeStatusTo('COMPLETED', uuid));

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};