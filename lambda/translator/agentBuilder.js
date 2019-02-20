const AWS = require('aws-sdk');
const https = require('https');
const fs = require("fs");
const path = require("path");
AWS.config.update({ region: "eu-west-2" });

exports.getHttpsAgent = async function() {
    const ca = getFileContent("/tls/ca.pem");
    const cert = getFileContent("/tls/cert.pem");
    const key = await getSsmValueForKey(process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME);

    let agent = new https.Agent({
        ca: ca,
        cert: cert,
        key: key
    });

    console.log(`ca length: ${ca.length}`);
    console.log(`cert length: ${cert.length}`);
    console.log(`key length: ${key.length}`);

    return agent;
}

async function getSsmValueForKey(key_name) {
    let ssm = new AWS.SSM();
    var params = {
        Name: key_name,
        WithDecryption: true
      };

    let item_value = await ssm.getParameter(params).promise();
    return item_value.Parameter.Value;
}

function getFileContent(relativeFilePath) {
    return fs.readFileSync(path.resolve(__dirname + relativeFilePath))
}