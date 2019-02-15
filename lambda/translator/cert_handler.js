const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2" });

exports.get_cert = function() {
    let certKey = getCertKey('/Debug/dale_peakall_key.pem');
    return certKey;
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