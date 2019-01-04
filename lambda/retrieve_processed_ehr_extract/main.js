const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    const uuid = event.pathParameters.uuid;

    const params = {
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID":  uuid
        }
    };

    ddb.get(params, function (err, data) {
        if (err) {
            handleError(err, uuid, callback)
        } else {
            let status = data.Item.PROCESS_STATUS;
            let processedEhrExtract = data.Item.PROCESS_PAYLOAD;

            console.log("Success", data);

            var response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify(
                    {
                        "uuid": uuid,
                        "status": `${status}`,
                        "payload": processedEhrExtract
                    }),
                "isBase64Encoded": false
            };

            callback(null, response);
        }
    });

};

function handleError(err, uuid, callback) {
    var response = {
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
    callback(err, response);
}
