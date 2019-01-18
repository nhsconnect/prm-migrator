const translate = require('./translate');

exports.handler = (event, context) => {

    translate.blat(event);

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};