const soapRequest = require('./easy_pds_request');
const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });
const libxmljs = require("libxmljs");

exports.verifyNhsNumber = async function (nhsNumber) {
    const url = 'https://msg.opentest.hscic.gov.uk';
    const path = 'smsp/pds';
    const headers = {
        'Content-Type': 'text/xml',
        'SOAPAction': 'urn:nhs-itk:services:201005:getNHSNumber-v1-0',
    };

    let xmlRequest = this.generateGetNHSNumberRequest();

    try {
        let timeout_ms = 10000;
        const { response } = await soapRequest(`${url}/${path}`, headers, xmlRequest, timeout_ms);
        let responseValidity = isValid(response, nhsNumber);
        console.log(`Response from PDS validity is: ${responseValidity}`);
        return responseValidity;    
    } catch (error) {
        if (error.error) {
            console.error(error.error);
        }
    }
    return false;
}

function isValid(xmlResponse, nhsNumber) {
    if (xmlResponse && xmlResponse.body) {
        var responseNhsNumber = getNhsNumberFromResponse(xmlResponse.body);
        return nhsNumber === responseNhsNumber;
    } else {
        console.log(`Response is not in the expected format: ${xmlResponse}`);
    }
    return false;
}

function getNhsNumberFromResponse(queryXml) {
    let xmlDoc = libxmljs.parseXml(queryXml);
    let responseNhsNumber = xmlDoc.get('string(//*[@root="2.16.840.1.113883.2.1.4.1"]/@extension)');
    return responseNhsNumber;
};

exports.generateRequest = function(nhsNumber) {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <!--This example message is provided for illustrative purposes only. It has had no clinical validation. Whilst every effort has been taken to ensure that the examples are consistent with the message specification, where there are conflicts with the written message specification or schema, the specification or schema shall be considered to take precedence-->
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:itk="urn:nhs-itk:ns:201005">
        <soap:Header>
            <wsa:MessageID>__MESSAGEID__</wsa:MessageID>
            <wsa:Action>urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0</wsa:Action>
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
                <itk:header service="urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0" trackingid="__INTERNAL_TRACKING_ID__">
                    <itk:auditIdentity>
                        <itk:id type="2.16.840.1.113883.2.1.3.2.4.18.27" uri="urn:nhs-uk:identity:ods:rhm:team1:C"/>
                    </itk:auditIdentity>
                    <itk:manifest count="1">
                        <itk:manifestitem id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7" mimetype="text/xml" profileid="urn:nhs-en:profile:getPatientDetailsByNHSNumberRequest-v1-0" base64="false" compressed="false" encrypted="false"/>
                    </itk:manifest>
                    <itk:senderAddress uri="urn:nhs-uk:addressing:ods:rhm:team1:C"/>
                </itk:header>
                <itk:payloads count="1">
                    <itk:payload id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7">
                        <getPatientDetailsByNHSNumberRequest-v1-0 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" moodCode="EVN" classCode="CACT">
                            <id root="16C2662F-1C6E-4F38-9B3F-5084F46CE3E2"/>
                            <code codeSystem="2.16.840.1.113883.2.1.3.2.4.17.284" code="getPatientDetailsByNHSNumberRequest-v1-0"/>
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
                        </getPatientDetailsByNHSNumberRequest-v1-0>
                    </itk:payload>
                </itk:payloads>
            </itk:DistributionEnvelope>
        </soap:Body>
    </soap:Envelope>
    `;
}

exports.generateGetNHSNumberRequest = function() {
    return `<?xml version="1.0" encoding="UTF-8"?><!--This example message is provided for illustrative purposes only. It has had no clinical validation. Whilst every effort has been taken to ensure that the examples are consistent with the message specification, where there are conflicts with the written message specification or schema, the specification or schema shall be considered to take precedence-->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:itk="urn:nhs-itk:ns:201005">
	<soap:Header>
		<wsa:MessageID>B72F7785-534C-11E6-ADCA-29C651A3BE6F</wsa:MessageID>
		<wsa:Action>urn:nhs-itk:services:201005:getNHSNumber-v1-0</wsa:Action>
		<wsa:To>https://192.168.54.6/smsp/pds</wsa:To>
		<wsa:From>
			<wsa:Address>192.168.54.7</wsa:Address>
		</wsa:From>
		<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
			<wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="D6CD5232-14CF-11DF-9423-1F9A910D4703">
				<wsu:Created>2016-07-27T11:10:23Z</wsu:Created>
				<wsu:Expires>2020-07-27T11:20:23Z</wsu:Expires>
			</wsu:Timestamp>
			<wsse:UsernameToken>
				<wsse:Username>TKS Server test</wsse:Username>
			</wsse:UsernameToken>
		</wsse:Security>
	</soap:Header>
	<soap:Body>
		<itk:DistributionEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
			<itk:header service="urn:nhs-itk:services:201005:getNHSNumber-v1-0" trackingid="B72F9E96-534C-11E6-ADCA-29C651A3BE6F">
				<itk:auditIdentity>
					<itk:id type="1.2.826.0.1285.0.2.0.107" uri="868000003114"/>
				</itk:auditIdentity>
				<itk:manifest count="1">
					<itk:manifestitem id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7" mimetype="text/xml" profileid="urn:nhs-en:profile:getNHSNumberRequest-v1-0" base64="false" compressed="false" encrypted="false"/>
				</itk:manifest>
				<itk:senderAddress uri="urn:nhs-uk:addressing:ods:rhm:team1:C"/>
			</itk:header>
			<itk:payloads count="1">
				<itk:payload id="uuid_808A9678-49B2-498B-AD75-1D7A0F1262D7">
					<getNHSNumberRequest-v1-0 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" moodCode="EVN" classCode="CACT">
						<id root="3E25ACE2-23F8-4A37-B446-6A37F31BF77C"/>
						<code codeSystem="2.16.840.1.113883.2.1.3.2.4.17.284" code="getNHSNumberRequest-v1-0"/>
						<queryEvent>
							<Person.DateOfBirth>
								<value value="19770705" />
								<semanticsText>Person.DateOfBirth</semanticsText>
							</Person.DateOfBirth>
							<Person.Gender>
								<value code="2" codeSystem="2.16.840.1.113883.2.1.3.2.4.16.25" />
								<semanticsText>Person.Gender</semanticsText>
							</Person.Gender>
							<Person.Name>
								<value>
									<given>LILITH</given>
									<family>LAWALI</family>
								</value>
								<semanticsText>Person.Name</semanticsText>
							</Person.Name>
							<Person.Postcode>
								<value>
									<postalCode>SK8 5HS</postalCode>
								</value>
								<semanticsText>Person.Postcode</semanticsText>
							</Person.Postcode>
						</queryEvent>
					</getNHSNumberRequest-v1-0>
				</itk:payload>
			</itk:payloads>
		</itk:DistributionEnvelope>
	</soap:Body>
</soap:Envelope>`
};