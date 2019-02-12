const convert = require('xml-js');

let xml = `
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="3474710087"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

exports.tpp_sample_xml = xml;
exports.tpp_sample_json = convert.xml2json(xml, {compact: true, spaces: 4});