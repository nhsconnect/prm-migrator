const convert = require('xml-js');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let options = {compact: true, spaces: 4};

let xml = `
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="3474710087"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

exports.tpp_sample_encodedXml = entities.encode(xml);;
exports.tpp_sample_json = convert.xml2json(xml, options);


let processedData = {
    patient: {
      identifier: {
        value: "3474710087"
      }
    }
  };


let convertedXml = convert.json2xml(processedData, options);
exports.processed_ehr_extract_encodedXml = entities.encode(convertedXml);;

let json = convert.xml2json(xml, options);
exports.processed_ehr_extract_json = json; 