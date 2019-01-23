const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const translator = require('./translate');
const validator = require('./validation');
const dbQueryHelper = require('./dbQueryHelper');

// AWS specific stuff
exports.handler = async (event, context) => {
    const client = new AWS.DynamoDB.DocumentClient();
    event.Records.forEach(record => {

        if (validator.isNhsNoValid(record) === true) {
            const uuid = record.dynamodb.Keys.PROCESS_ID.S;
            const payload = translator.translate(record);

            client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid));
            client.update(dbQueryHelper.changePayloadTo(payload, uuid));
            client.update(dbQueryHelper.changeStatusTo('COMPLETED', uuid));
        } else {
            return {
                statusCode: 404,
                body: '',
                isBase64Encoded: false
            }
        }
    });

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};

exports.main = function (record) {
    if (validator.isNhsNoValid(record) === true) {

        return {
            status: "COMPLETED",
            correlationId: "101",
            translation: translator.translate(record),
            original: record
        }

    } else {
        return {
            status: "FAILED",
            correlationId: "101",
            reason: {
                code: "PATIENT_VALIDATION_10001",
                message: "Given NHS Number could not be found on PDS"
            },
            original: record
        }
    }
};