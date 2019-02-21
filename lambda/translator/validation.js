const pds_client = require('./pds_client');
const convert = require('xml-js');
const util = require('util');

exports.isNhsNoValid = async function (record) {
    let extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    let result = await pds_client.verifyNhsNumber(nhsNumber);
    return result;
};