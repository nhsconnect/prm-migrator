exports.isNhsNoValid = function (record) {
    let extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    return (nhsNumber === '3474710087');
};