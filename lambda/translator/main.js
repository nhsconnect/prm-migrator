exports.handler = (event, context) => {

    
    return {
        statusCode: 200,
        body: `<Patient><identifier><value>1234567890</value></identifier></Patient>`,
        isBase64Encoded: false
    };
};
