let convert = require('xml-js');

let xmlWithValidNhsNo = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="3474710087"/>
                    </patient>
                </recordTarget>
                <author typeCode="AUT">
                    <time value="20131114110655"/>
                    <AgentOrgSDS classCode="AGNT">
                        <agentOrganizationSDS classCode="ORG" determinerCode="INSTANCE">
                            <id extension="Test_Source" root="1.2.826.0.1285.0.1.10"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </author>
                <destination typeCode="DST">
                    <AgentOrgSDS classCode="AGNT">
                        <agentOrganizationSDS classCode="ORG" determinerCode="INSTANCE">
                            <id extension="Test_Destination" root="1.2.826.0.1285.0.1.10"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </destination>
            </EhrExtract>
        `;

let convertedXmlWtihValidNhsNo = convert.xml2json(xmlWithValidNhsNo, { compact: true, spaces: 4 });

let xmlWithInvalidNhsNo = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="444444444"/>
                    </patient>
                </recordTarget>
                <author typeCode="AUT">
                    <time value="20131114110655"/>
                    <AgentOrgSDS classCode="AGNT">
                        <agentOrganizationSDS classCode="ORG" determinerCode="INSTANCE">
                            <id extension="Test_Source" root="1.2.826.0.1285.0.1.10"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </author>
                <destination typeCode="DST">
                    <AgentOrgSDS classCode="AGNT">
                        <agentOrganizationSDS classCode="ORG" determinerCode="INSTANCE">
                            <id extension="Test_Destination" root="1.2.826.0.1285.0.1.10"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </destination>
            </EhrExtract>
        `;

let convertedXmlWtihInvalidNhsNo = convert.xml2json(xmlWithInvalidNhsNo, { compact: true, spaces: 4 });

let xmlWithInvalidNhsNo2 = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="1234567"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

let convertedXmlWtihInvalidNhsNo2 = convert.xml2json(xmlWithInvalidNhsNo2, { compact: true, spaces: 4 });


// SINGLE RECORDS

exports.aNewRecord = {
    "eventID": "1",
    "eventVersion": "1.0",
    "dynamodb": {
        "Keys": {
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "NewImage": {
            "PROCESS_PAYLOAD": {
                "S": `${convertedXmlWtihValidNhsNo}`
            },
            "PROCESS_STATUS": {
                "S": "PROCESSING"
            },
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "StreamViewType": "NEW_IMAGE",
        "SequenceNumber": "111",
        "SizeBytes": 26
    },
    "awsRegion": "eu-west-2",
    "eventName": "INSERT",
    "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
    "eventSource": "aws:dynamodb"
};

exports.aBadRecord = {
    "Records": [
        {
            "eventID": "1",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": 'Xlahh'
                    },
                    "PROCESS_STATUS": {
                        "S": "ACCEPTED"
                    },
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SequenceNumber": "111",
                "SizeBytes": 26
            },
            "awsRegion": "eu-west-2",
            "eventName": "INSERT",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        }]
};

exports.invalidNhsNoRecord = {
    "eventID": "1",
    "eventVersion": "1.0",
    "dynamodb": {
        "Keys": {
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "NewImage": {
            "PROCESS_PAYLOAD": {
                "S": `${convertedXmlWtihInvalidNhsNo}`
            },
            "PROCESS_STATUS": {
                "S": "PROCESSING"
            },
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "StreamViewType": "NEW_IMAGE",
        "SequenceNumber": "111",
        "SizeBytes": 26
    },
    "awsRegion": "eu-west-2",
    "eventName": "INSERT",
    "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
    "eventSource": "aws:dynamodb"
};

exports.invalidNhsNoRecord2 = {
    "eventID": "1",
    "eventVersion": "1.0",
    "dynamodb": {
        "Keys": {
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "NewImage": {
            "PROCESS_PAYLOAD": {
                "S": `${convertedXmlWtihInvalidNhsNo2}`
            },
            "PROCESS_STATUS": {
                "S": "PROCESSING"
            },
            "PROCESS_ID": {
                "S": "101"
            }
        },
        "StreamViewType": "NEW_IMAGE",
        "SequenceNumber": "111",
        "SizeBytes": 26
    },
    "awsRegion": "eu-west-2",
    "eventName": "INSERT",
    "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
    "eventSource": "aws:dynamodb"
};

// MULTIPLE RECORDS

exports.twoNewRecords = {
    "Records": [
        {
            "eventID": "1",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihValidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SequenceNumber": "111",
                "SizeBytes": 26
            },
            "awsRegion": "eu-west-2",
            "eventName": "INSERT",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        },
        {
            "eventID": "2",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihValidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SizeBytes": 28
            },
            "awsRegion": "eu-west-2",
            "eventName": "INSERT",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        }
    ]
};

exports.twoModifiedRecords = {
    "Records": [
        {
            "eventID": "1",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihValidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SequenceNumber": "111",
                "SizeBytes": 26
            },
            "awsRegion": "eu-west-2",
            "eventName": "MODIFY",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        },
        {
            "eventID": "2",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihValidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SizeBytes": 28
            },
            "awsRegion": "eu-west-2",
            "eventName": "MODIFY",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        }
    ]
};

exports.invalidNhsNoRecords = {
    "Records": [
        {
            "eventID": "1",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihInvalidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SequenceNumber": "111",
                "SizeBytes": 26
            },
            "awsRegion": "eu-west-2",
            "eventName": "INSERT",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        },
        {
            "eventID": "2",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihInvalidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SizeBytes": 28
            },
            "awsRegion": "eu-west-2",
            "eventName": "MODIFY",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        }
    ]
};

exports.oneFailingOneSuccessfulRecord = {
    "Records": [
        {
            "eventID": "1",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihValidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "101"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SequenceNumber": "111",
                "SizeBytes": 26
            },
            "awsRegion": "eu-west-2",
            "eventName": "INSERT",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        },
        {
            "eventID": "2",
            "eventVersion": "1.0",
            "dynamodb": {
                "Keys": {
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "NewImage": {
                    "PROCESS_PAYLOAD": {
                        "S": `${convertedXmlWtihInvalidNhsNo}`
                    },
                    "PROCESS_STATUS": {
                        "S": "PROCESSING"
                    },
                    "PROCESS_ID": {
                        "S": "102"
                    }
                },
                "StreamViewType": "NEW_IMAGE",
                "SizeBytes": 28
            },
            "awsRegion": "eu-west-2",
            "eventName": "MODIFY",
            "eventSourceARN": "arn:aws:dynamodb:eu-west-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899",
            "eventSource": "aws:dynamodb"
        }
    ]
};

// PDS test data

exports.verifyNhsNoResponse = `<?xml version="1.0" encoding="UTF-8"?>
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
										<id root="2.16.840.1.113883.2.1.4.1" extension="9999345201"/>
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

exports.buildNhsNoValidationQuery = (nhsNo) => {
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
								<value root="2.16.840.1.113883.2.1.4.1" extension="${nhsNo}"/>
								<semanticsText>Person.NHSNumber</semanticsText>
							</Person.NHSNumber>
						</queryEvent>
					</verifyNHSNumberRequest-v1-0>
				</itk:payload>
			</itk:payloads>
		</itk:DistributionEnvelope>
	</soap:Body>
</soap:Envelope>`};

exports.verifyNhsNoInvalidResponse = `<?xml version="1.0" encoding="UTF-8"?>
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
								<value value="false"/>
								<subject typeCode="SBJ">
									<patient classCode="PAT">
										<id root="2.16.840.1.113883.2.1.4.1" extension="444444444444"/>
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

exports.verifyNhsNoInvalidRequest = `<?xml version="1.0" encoding="UTF-8"?>
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
								<value root="2.16.840.1.113883.2.1.4.1" extension="444444444444"/>
								<semanticsText>Person.NHSNumber</semanticsText>
							</Person.NHSNumber>
						</queryEvent>
					</verifyNHSNumberRequest-v1-0>
				</itk:payload>
			</itk:payloads>
		</itk:DistributionEnvelope>
	</soap:Body>
</soap:Envelope>`;
