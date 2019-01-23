const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const translator = require('./translate');
const validator = require('./validation');
const dbQueryHelper = require('./dbQueryHelper');

// AWS specific stuff
exports.handler = async (event, context) => {
    const client = new AWS.DynamoDB.DocumentClient();
    let httpStatusCode;

    event.Records.forEach(record => {
        const uuid = record.dynamodb.Keys.PROCESS_ID.S;
        client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid));

        const translationResult = this.main(record);
        const { status } = translationResult;
        const { translation } = translationResult;

        httpStatusCode = translationResult.status === 'COMPLETED' ? 200 : 404;


        client.update(dbQueryHelper.changePayloadTo(translation, uuid));
        client.update(dbQueryHelper.changeStatusTo(status, uuid));
    });
    return {
        statusCode: httpStatusCode,
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