/* ignore file coverage: as it's just a fake */
const convert = require('fast-xml-parser');
const https = require('https');
const NHS_NUMBER_VALIDITY_MAP = {
    "9999345201": true,
    "3474710087": true,
    "444444444444": false,
};

exports.verifyNhsNumber = async function (nhsNumber) {

    return new Promise((resolve, reject) => {
        let response = false
        // send the request
        const options = {
            hostname: 'https://192.168.128.11',
            port: 443,
            path: '/smsp/pds',
            method: 'POST',
            headers: {
                "SOAPAction": "urn:nhs-itk:services:201005:verifyNHSNumber-v1-0",
                "content-type": "text/xml"
            }
        };

        function callback(error, responseXml) {
            // return the result
            if (error) {
                // if it errors, look it up in local database
                const nhsNo = getNHSNumberFromResponse(responseXml);
                resolve(NHS_NUMBER_VALIDITY_MAP[nhsNo] || false)
            }
            return resolve(response)
        }

        const req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                // parse the response
                callback(true, generateResponse(nhsNumber))
            });
        });

        req.on('error', (e) => {
            // parse the response
            callback(true, generateResponse(nhsNumber))
        });

        req.write(generateRequest(nhsNumber));

        req.end();

    });
};

function getNHSNumberFromRequest(queryXml) {
    // const options = {compact: true, spaces: 4};
    const jsonQuery = convert.parse(queryXml);
    return jsonQuery['soap:Envelope']['soap:Body']
        ['itk:DistributionEnvelope']['itk:payloads']['itk:payload']
        ['verifyNHSNumberRequest-v1-0']['queryEvent']['Person.NHSNumber']
        ['value']['_attributes']['extension'];
};

function getNHSNumberFromResponse(queryXml) {
    // const options = {compact: true, spaces: 4};
    const jsonQuery = convert.parse(queryXml, {ignoreAttributes : false});
    return jsonQuery['soap:Envelope']['soap:Body']
        ['itk:DistributionEnvelope']['itk:payloads']['itk:payload']
        ['verifyNHSNumberResponse-v1-0']['component']['validIdentifier']
        ['subject']['patient']['id']['@_extension'];
};

function generateResponse(nhsNumber) {
    return `<?xml version="1.0" encoding="UTF-8"?>
            <!--This example message is provided for illustrative purposes only. It has had no clinical validation. Whilst every effort has been taken to ensure that the examples are consistent with the message specification, where there are conflicts with the written message specification or schema, the specification or schema shall be considered to take precedence-->
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:itk="urn:nhs-itk:ns:201005">
                <soap:Header>
                    <wsa:MessageID>__MESSAGEID__</wsa:MessageID>
                    <wsa:Action>urn:nhs-itk:services:201005:verifyNHSNumber-v1-0Response</wsa:Action>
                    <wsa:To>__SENDTO__</wsa:To>
                    <wsa:From>
                        <wsa:Address>http://localhost:4000</wsa:Address>
                    </wsa:From>
                    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                        <wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="D6CD5232-14CF-11DF-9423-1F9A910D4703">
                            <wsu:Created>__TIMESTAMP__</wsu:Created>
                            <wsu:Expires>__EXPIRES__</wsu:Expires>
                        </wsu:Timestamp>
                        <wsse:UsernameToken>
                            <wsse:Username>TKS Server test</wsse:Username>
                        </wsse:UsernameToken>
                    </wsse:Security>
                </soap:Header>
                <soap:Body>
                    <itk:DistributionEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                        <itk:header service="urn:nhs-itk:services:201005:verifyNHSNumber-v1-0Response" trackingid="__INTERNAL_TRACKING_ID__">
                            <itk:auditIdentity>
                                <itk:id type="2.16.840.1.113883.2.1.3.2.4.18.27" uri="urn:nhs-uk:identity:ods:rhm:team1:C"/>
                            </itk:auditIdentity>
                            <itk:manifest count="1">
                                <itk:manifestitem id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7" mimetype="text/xml" profileid="urn:nhs-en:profile:verifyNHSNumberResponse-v1-0" base64="false" compressed="false" encrypted="false"/>
                            </itk:manifest>
                            <itk:senderAddress uri="urn:nhs-uk:addressing:ods:rhm:team1:C"/>
                        </itk:header>
                        <itk:payloads count="1">
                            <itk:payload id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7">
                                <verifyNHSNumberResponse-v1-0 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" moodCode="EVN" classCode="OBS">
                                    <id root="3E25ACE2-23F8-4A37-B446-6A37F31BF77B"/>
                                    <code codeSystem="2.16.840.1.113883.2.1.3.2.4.17.284" code="verifyNHSNumberResponse-v1-0"/>
                                    <value codeSystem="2.16.840.1.113883.2.1.3.2.4.17.285" code="SMSP-0000"/>
                                    <component typeCode="COMP">
                                        <validIdentifier moodCode="EVN" classCode="OBS">
                                            <code codeSystem="2.16.840.1.113883.2.1.3.2.4.17.287" code="VI"/>
                                            <value value="true"/>
                                            <subject typeCode="SBJ">
                                                <patient classCode="PAT">
                                                    <id root="2.16.840.1.113883.2.1.4.1" extension="${nhsNumber}"/>
                                                </patient>
                                            </subject>
                                        </validIdentifier>
                                    </component>
                                </verifyNHSNumberResponse-v1-0>
                            </itk:payload>
                        </itk:payloads>
                    </itk:DistributionEnvelope>
                </soap:Body>
            </soap:Envelope>`;
}

function generateRequest(nhsNumber) {
    return `<?xml version="1.0" encoding="UTF-8"?>
            <!--This example message is provided for illustrative purposes only. It has had no clinical validation. Whilst every effort has been taken to ensure that the examples are consistent with the message specification, where there are conflicts with the written message specification or schema, the specification or schema shall be considered to take precedence-->
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:itk="urn:nhs-itk:ns:201005">
                <soap:Header>
                    <wsa:MessageID>__MESSAGEID__</wsa:MessageID>
                    <wsa:Action>urn:nhs-itk:services:201005:verifyNHSNumber-v1-0</wsa:Action>
                    <wsa:To>__SENDTO__</wsa:To>
                    <wsa:From>
                        <wsa:Address>http://localhost:4000</wsa:Address>
                    </wsa:From>
                    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                        <wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="D6CD5232-14CF-11DF-9423-1F9A910D4703">
                            <wsu:Created>__TIMESTAMP__</wsu:Created>
                            <wsu:Expires>__EXPIRES__</wsu:Expires>
                        </wsu:Timestamp>
                        <wsse:UsernameToken>
                            <wsse:Username>TKS Server test</wsse:Username>
                        </wsse:UsernameToken>
                    </wsse:Security>
                </soap:Header>
                <soap:Body>
                    <itk:DistributionEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                        <itk:header service="urn:nhs-itk:services:201005:verifyNHSNumber-v1-0" trackingid="__INTERNAL_TRACKING_ID__">
                            <itk:auditIdentity>
                                <itk:id type="2.16.840.1.113883.2.1.3.2.4.18.27" uri="urn:nhs-uk:identity:ods:rhm:team1:C"/>
                            </itk:auditIdentity>
                            <itk:manifest count="1">
                                <itk:manifestitem id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7" mimetype="text/xml" profileid="urn:nhs-en:profile:verifyNHSNumberRequest-v1-0" base64="false" compressed="false"  encrypted="false"/>
                            </itk:manifest>
                            <itk:senderAddress uri="urn:nhs-uk:addressing:ods:rhm:team1:C"/>
                        </itk:header>
                        <itk:payloads count="1">
                            <itk:payload id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7">
                                <verifyNHSNumberRequest-v1-0 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" moodCode="EVN" classCode="CACT">
                                    <id root="16C2662F-1C6E-4F38-9B3F-5084F46CE3E1"/>
                                    <code codeSystem="2.16.840.1.113883.2.1.3.2.4.17.284" code="verifyNHSNumberRequest-v1-0"/>
                                    <queryEvent>
                                        <Person.DateOfBirth>
                                            <value value="19890101"/>
                                            <semanticsText>Person.DateOfBirth</semanticsText>
                                        </Person.DateOfBirth>
                                        <Person.NHSNumber>
                                            <value root="2.16.840.1.113883.2.1.4.1" extension="${nhsNumber}"/>
                                            <semanticsText>Person.NHSNumber</semanticsText>
                                        </Person.NHSNumber>
                                    </queryEvent>
                                </verifyNHSNumberRequest-v1-0>
                            </itk:payload>
                        </itk:payloads>
                    </itk:DistributionEnvelope>
                </soap:Body>
            </soap:Envelope>`;
}