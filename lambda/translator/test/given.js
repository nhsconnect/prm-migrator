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
                "S": "1234567890"
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

exports.someNewRecords = {
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
                        "S": "1234567890"
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
                        "S": "1234567891"
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