const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const translator = require('./translate');
const validator = require('./validation');
const dbQueryHelper = require('./dbQueryHelper');
const sleep = m => new Promise(r => setTimeout(r, m));
const dayjs = require('dayjs');

// AWS specific stuff
exports.handler = async (event, context) => {
    const client = new AWS.DynamoDB.DocumentClient();
    let translatedRecords = [];
    await asyncForEach(event.Records, async (record) => {
        if (record.eventName === 'INSERT') {
            const uuid = record.dynamodb.Keys.PROCESS_ID.S;
            await client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid)).promise();
            await sleep(1000);
            let status;
            let translationResult;

            let extractData;
            let extractData_source;
            let extractData_destination;

            try {
                extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
                extractData_source = extractData.EhrExtract.author.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;
                extractData_destination = extractData.EhrExtract.destination.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;

                translationResult = this.main(record);
                status = translationResult.status;
                const { translation } = translationResult;
                translatedRecords.push(translationResult);
                await client.update(dbQueryHelper.changePayloadTo(translation, translationResult.correlationId)).promise();

            } catch (error) {
                status = "ERROR";
            }
            await client.update(dbQueryHelper.changeStatusTo(status, uuid)).promise();
            console.log({
                correlation_id: uuid,
                time_created: dayjs(Date.now()).toISOString(),
                event_type: "process",
                event: {
                    source: extractData_source,
                    destination: extractData_destination,
                    process_status: status
                }
            });
        }
    });
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