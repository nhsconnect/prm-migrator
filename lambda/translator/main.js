const translator = require('./translator');

exports.handler = (event, context) => {

    event.Records.forEach(record => {
        translator.translate(record);    
    });

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};