const convert = require('xml-js');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let processedData = {
    patient: {
      identifier: {
        value: "3474710087"
      }
    }
  };

let options = {compact: true, spaces: 4};

let xml = convert.json2xml(processedData, options);
exports.processed_ehr_extract_encodedXml = entities.encode(xml);;

let json = convert.xml2json(xml, options);
exports.processed_ehr_extract_json = json; 