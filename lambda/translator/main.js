const translator = require('./translator');
const validator = require('./validation');

exports.handler = async (event, context) => {

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

exports.main = function (record) {
    if (validator.isNhsNoValid(record) === true) {
    return {
        status: "COMPLETED",
        correlationId: "101",
        translation: {
            patient: {
                nhsNumber: "3474710087"
            }
        }
    }

    } else {
        return {
            status: "FAILED",
            correlationId: "101",
            reason: {
                code: "PATIENT_VALIDATION_10001",
                message: "Given NHS Number could not be found on PDS"
            }
        }
}};