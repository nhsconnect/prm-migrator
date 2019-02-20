const axios = require('axios');
const https = require('https');
const agentBuilder = require('./agentBuilder');
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
    
  let agent = agentBuilder.getHttpsAgent();

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      headers,
      data: xml,
      timeout,
      httpsAgent: agent
    }).then((response) => {
      resolve({
        response: {
          body: response.data,
          statusCode: response.status,
        },
      });
    }).catch((error) => {
      if (error.response && error.response.data) {
        console.error(`SOAP FAIL: ${error}`);
        reject(error.response.data);
      } else {
        console.error(`SOAP FAIL: ${error}`);
        reject(error);
      }
    });
  });
};
