const agentBuilder = require('./agentBuilder');
const request = require('request-promise-native');

module.exports = async function soapRequest(url, headers, xml, timeout = 10000) {

  let agentOptions = await agentBuilder.getHttpsAgent();

  console.log(`RequestMessage length: ${xml.length}`);

  const requestOptions = {    
    method: 'POST',
    url: url,
    agentOptions: agentOptions,
    body: xml,
    headers: headers,
    timeout: timeout
  };
  
  return await request.post(requestOptions);
};
