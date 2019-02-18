const axios = require('axios');
const https = require('https');
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const cert_handler = require('./cert_handler');
/**
 * @author Caleb Lemoine
 * @param {string} url endpoint URL
 * @param {string} headers  HTTP headers, can be string or object
 * @param {string} xml SOAP envelope, can be read from file or passed as string
 * @param {int} timeout Milliseconds before timing out request
 * @promise response
 * @reject {error}
 * @fulfill {body,statusCode}
 * @returns {Promise.response{body,statusCode}}
 */
module.exports = function soapRequest(url, headers, xml, timeout = 10000) {
    
    let certKey = cert_handler.get_cert();

    let agent = new https.Agent({ 
        ca: certKey
    });
      
    axios.get(url, { agent: agent });

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      headers,
      data: xml,
      timeout,
    }).then((response) => {
      resolve({
        response: {
          body: response.data,
          statusCode: response.status,
        },
      });
    }).catch((error) => {
      if (error.response) {
        console.error(`SOAP FAIL: ${error}`);
        reject(error.response.data);
      } else {
        console.error(`SOAP FAIL: ${error}`);
        reject(error);
      }
    });
  });
};
