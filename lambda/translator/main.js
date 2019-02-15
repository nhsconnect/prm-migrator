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

            let start_time = dayjs(Date.now());

            let log_event = {
                correlation_id: uuid,
                time_created: "",
                event_type: "process",
                event: {
                    source: "Unknown",
                    destination: "Unknown",
                    process_status: "",
                    translation: {
                    }
                }
            };

            try {
                translationResult = this.main(record);

                extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
                log_event.event.source = extractData.EhrExtract.author.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;
                log_event.event.destination = extractData.EhrExtract.destination.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;
                status = translationResult.status;

                if (status === "COMPLETED") {
                    const { translation } = translationResult;

                    translatedRecords.push(translationResult);
                    await client.update(dbQueryHelper.changePayloadTo(translation, translationResult.correlationId)).promise();
                }
            } catch (error) {
                status = "ERROR";
                log_event.event.translation.error = error;
            }
            await client.update(dbQueryHelper.changeStatusTo(status, uuid)).promise();

            let end_time = dayjs(Date.now());
            log_event.event.process_status = status;
            log_event.time_created = dayjs(Date.now()).toISOString();
            log_event.event.translation.time_taken = end_time.diff(start_time, "millisecond");

            console.log(JSON.stringify(log_event));
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
            translation: FhirPayload,
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