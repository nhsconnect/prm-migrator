const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const dbQueryHelper = require('./dbQueryHelper');
const EasyXml = require('easyxml');

exports.translate = function(event){
    let client = new AWS.DynamoDB.DocumentClient();

    let extractData = JSON.parse(event.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    let uuid = event.dynamodb.Keys.PROCESS_ID.S;

    client.update(dbQueryHelper.changeStatusTo('PROCESSING', uuid));

    let payload = {
        patient: {
          identifier: {
            value: nhsNumber
          }
        }
      };

    client.update(dbQueryHelper.changePayloadTo(payload, uuid));
    client.update(dbQueryHelper.changeStatusTo('COMPLETED', uuid));
};