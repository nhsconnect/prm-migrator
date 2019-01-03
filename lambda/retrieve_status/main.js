const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-2'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function (event, context, callback) {
    const uuid = event.pathParameters.uuid;

    const params = {
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID": {"S": uuid}
        },
        ProjectionExpression: "PROCESS_PAYLOAD"
    };

    var status;

    ddb.getItem(params, function (err, data) {


        if (err) {
            var response = {
                "statusCode": 500,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify(
                    {
                        "uuid": uuid,
                        "status": `${status}`
                    }),
                "isBase64Encoded": false
            };
            console.log("Error", err);
            callback(null, response);

        } else {
            status = data.Item.PROCESS_PAYLOAD.S;
            console.log(status)
            console.log("Success", data);


            var response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
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