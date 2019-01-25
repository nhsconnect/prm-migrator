const fakePDS = require('./fakepds');
const convert = require('xml-js');
const util = require('util');

exports.isNhsNoValid = function (record) {
    let extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    fakePDS.verifyNhsNumber(nhsNumber)
        .then((result) => {
        // parse the XML result here
        return parseResult(result);
        })
        .catch(err => {console.log(err)});

    return (nhsNumber === '3474710087');
};

function parseResult(xml) {
    const options = {compact: true, spaces: 4};
    const jsonQuery = JSON.parse(convert.xml2json(xml, options));
};