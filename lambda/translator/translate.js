const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });

exports.translate = function(event){

    let extractData = JSON.parse(event.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    let payload = {
        patient: {
          identifier: {
            value: nhsNumber
          }
        }
      };

    return payload;
};