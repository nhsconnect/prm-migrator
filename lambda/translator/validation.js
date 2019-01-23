const fakePDS = require('./fakepds');

exports.isNhsNoValid = function (record) {
    let extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    const responseXml = fakePDS.verifyNhsNumber(nhsNumber);



    return (nhsNumber === '3474710087');
};