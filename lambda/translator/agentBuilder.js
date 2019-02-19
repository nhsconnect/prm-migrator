const AWS = require('aws-sdk');
const https = require('https');
AWS.config.update({ region: "eu-west-2" });

exports.getHttpAgent = function() {
    let ca = getCertKey(process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME);
    // let key = getCertKey('dale_peakall_get_real_name');
    // let cert = ''

    let agent = new https.Agent({
       ca: ca
    });

    return agent;
}

function getCertKey(key_name) {
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
            certKey = data;
        }
      });

    return certKey;
}