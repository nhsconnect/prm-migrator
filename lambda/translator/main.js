const AWS = require('aws-sdk');
AWS.config.update({region: "eu-west-2"});

exports.handler = (event, context) => {
    let nhsNumber = event.dynamodb.NewImage.PROCESS_PAYLOAD.S;
    let uuid = event.dynamodb.Keys.PROCESS_ID.S;
    
    let client = new AWS.DynamoDB.DocumentClient();

    client.update({
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID": uuid
        },
        UpdateExpression: "set PROCESS_STATUS = :p",
        ExpressionAttributeValues: {
            ":p": 'PROCESSING',
        },
        ReturnValues: "UPDATED_NEW"
    });
    return {
        statusCode: 200,
        body: `<Patient><identifier><value>${nhsNumber}</value></identifier></Patient>`,
        isBase64Encoded: false
    };
};
