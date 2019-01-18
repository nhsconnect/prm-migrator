const translate = require('./translate');

exports.handler = (event, context) => {

    event.Records.forEach(record => {
        translate.blat(record);    
    });

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};