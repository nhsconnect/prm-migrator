const fakePDS = require('./fakepds');
const given = require('./test/given');
const convert = require('xml-js');

exports.isNhsNoValid = function (record) {
    console.log("record here:--->",record)
    let extractData = JSON.parse(record.dynamodb.NewImage.PROCESS_PAYLOAD.S);
    let nhsNumber = extractData.EhrExtract.recordTarget.patient.id._attributes.extension;

    const xmlQuery = given.buildNhsNoValidationQuery(nhsNumber);

    fakePDS.verifyNhsNumber(xmlQuery)
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

    console.log(jsonQuery)

};