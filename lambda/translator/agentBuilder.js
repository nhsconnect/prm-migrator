const AWS = require('aws-sdk');
const https = require('https');
const fs = require("fs");
const path = require("path");
AWS.config.update({ region: "eu-west-2" });

exports.getHttpsAgent = function() {
    const ca = getFileContent("/tls/ca.pem");
    const cert = getFileContent("/tls/cert.pem");
    const key = getSsmValueForKey(process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME);

    let agent = new https.Agent({
        ca: ca,
        cert: cert,
        key: key
    });

    return agent;
}

function getSsmValueForKey(key_name) {
    let ssm = new AWS.SSM();
    let certKey;
    var params = {
        Name: key_name,
        WithDecryption: true
      };
      ssm.getParameter(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            certKey = data.Parameter.Value;
        }
      });

    return certKey;
}

function getFileContent(relativeFilePath) {
    return fs.readFileSync(path.resolve(__dirname + relativeFilePath))
}