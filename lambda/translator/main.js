exports.handler = (event, context) => {
    let nhsNumber = event.dynamodb.NewImage.PROCESS_PAYLOAD.S;

    return {
        statusCode: 200,
        body: `<Patient><identifier><value>${nhsNumber}</value></identifier></Patient>`,
        isBase64Encoded: false
    };
};
