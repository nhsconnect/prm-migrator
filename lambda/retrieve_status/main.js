const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
    const uuid = event.pathParameters.uuid;

    updateStatusToProcessing(uuid, callback);

    const params = {
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID":  uuid
        },
        ProjectionExpression: "PROCESS_STATUS"
    };

    let status;

    ddb.get(params, function (err, data) {

        if (err) {
            handleError(err, uuid, callback)
        } else {
            status = data.Item.PROCESS_STATUS;
            console.log("Success", data);

            let response = {
                "statusCode": 200,
                "body": JSON.stringify(
                    {
                        "uuid": uuid,
                        "status": `${status}`
                    }),
                "isBase64Encoded": false
            };

            callback(null, response);
        }
    });

};

function updateStatusToProcessing(uuid, callback) {
    const params = {
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID":  uuid
        },
        UpdateExpression: "set PROCESS_STATUS = :p",
        ExpressionAttributeValues:{
            ":p":"PROCESSING",
        },
        ReturnValues:"UPDATED_NEW"
    };
    ddb.update(params, function(err, data) {
        if (err) {
            handleError(err, uuid, callback)
        } else {
            let status = data.Attributes;
            console.log("Update Data Attributes", data);
            return;
        }
    });
}

function handleError(err, uuid, callback) {
    let response = {
        "statusCode": 500,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(
            {
                "message": `Could not retrieve the process status for process id ${uuid}.`
            }),
        "isBase64Encoded": false
    };
    console.log("Error", err);
    callback(null, response);
}
