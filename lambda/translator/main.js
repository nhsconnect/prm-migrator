const translator = require('./translator');
const validator = require('./validation');

exports.handler = (event, context) => {

    event.Records.forEach(record => {
        if (validator.isNhsNoValid(record) === true) {
            translator.translate(record);
        } else {
            return {
                statusCode: 404,
                body: '',
                isBase64Encoded: false
            }
        }
    });

    return {
        statusCode: 200,
        body: '',
        isBase64Encoded: false
    };
};