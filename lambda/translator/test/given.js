let convert = require('xml-js');

let xmlWithValidNhsNo = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="3474710087"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

let convertedXmlWtihValidNhsNo = convert.xml2json(xmlWithValidNhsNo, {compact: true, spaces: 4});

let xmlWithInvalidNhsNo = `
            <?xml version="1.0" encoding="UTF-8"?>
            <EhrExtract classCode="EXTRACT" moodCode="EVN">
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="444444444"/>
                    </patient>
                </recordTarget>
            </EhrExtract>
        `;

let convertedXmlWtihInvalidNhsNo = convert.xml2json(xmlWithInvalidNhsNo, {compact: true, spaces: 4});

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
