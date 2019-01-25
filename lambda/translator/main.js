const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const translator = require('./translate');
const validator = require('./validation');
const dbQueryHelper = require('./dbQueryHelper');
const sleep = m => new Promise(r => setTimeout(r, m));

// AWS specific stuff
exports.handler = async (event, context) => {
    const client = new AWS.DynamoDB.DocumentClient();
    let translatedRecords = [];
    console.log('Translator: Processing started');

    await asyncForEach(event.Records, async (record) => {
        if (record.eventName === 'INSERT') {
            const uuid = record.dynamodb.Keys.PROCESS_ID.S;
            await client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid)).promise();
            await sleep(1000)

            const translationResult = this.main(record);
            const { status } = translationResult;
            const { translation } = translationResult;
    
            translatedRecords.push(translationResult);
            await client.update(dbQueryHelper.changePayloadTo(translation, translationResult.correlationId)).promise();
            await client.update(dbQueryHelper.changeStatusTo(status, translationResult.correlationId)).promise();
        }
    });
    console.log('Processing complete');
    return translatedRecords;
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

exports.main = function (record) {
    if (validator.isNhsNoValid(record) === true) {
        const FhirPayload = translator.translate(record)
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