let convert = require('xml-js');

let xml = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="3474710087"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

let convertedXml = convert.xml2json(xml, {compact: true, spaces: 4});

exports.tpp_sample = convertedXml;
