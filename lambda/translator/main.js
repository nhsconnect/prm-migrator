const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const translator = require('./translate');
const validator = require('./validation');
const dbQueryHelper = require('./dbQueryHelper');

// AWS specific stuff
exports.handler = async (event, context) => {
    const client = new AWS.DynamoDB.DocumentClient();
    let translatedRecords = [];
    console.log('Processing started');

    event.Records.forEach(async (record) => {
        const uuid = record.dynamodb.Keys.PROCESS_ID.S;
        await client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid)).promise();

        const translationResult = this.main(record);
        const { status } = translationResult;
        const { translation } = translationResult;

        translatedRecords.push(translationResult);

        await client.update(dbQueryHelper.changePayloadTo(translation, translationResult.correlationId)).promise();
        await client.update(dbQueryHelper.changeStatusTo(status, translationResult.correlationId)).promise();
        console.log('Processing single record completed');
    });
    console.log('Processing complete');
    return translatedRecords;
};

exports.main = function (record) {
    if (validator.isNhsNoValid(record) === true) {
        return {
            status: "COMPLETED",
            correlationId: record.dynamodb.Keys.PROCESS_ID.S,
            translation: translator.translate(record),
            original: record
        }
    } else {
        return {
            status: "FAILED",
            correlationId: record.dynamodb.Keys.PROCESS_ID.S,
            reason: {
                code: "PATIENT_VALIDATION_10001",
                message: "Given NHS Number could not be found on PDS"
            },
            original: record
        }
    }
};