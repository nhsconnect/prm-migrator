const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

AWS.config.update({region: 'eu-west-2'});

const MigrationEventStates = {
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
}

class MigrationEventStateMachine {
    constructor(initialState) {
        this.state = MigrationEventStates.REJECTED;
    }

    get currentState() {
        return this.state;
    }
}

exports.main = function() {
    return new MigrationEventStateMachine()
}

const INITIAL_STATUS = "PROCESSING";
exports.handler = function (event, context, callback) {
    const uuid = uniqid();
    const params = {
        TableName: "PROCESS_STORAGE",
        Item: {
            "PROCESS_ID": {S: `${uuid}`},
            "PROCESS_PAYLOAD": {S: `${INITIAL_STATUS}`}
        }
    };

    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
    const response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(
            {
                "uuid": `${uuid}`,
                "status": `${INITIAL_STATUS}`
            }
        ),
        "isBase64Encoded": false
    };

    callback(null, response);
};