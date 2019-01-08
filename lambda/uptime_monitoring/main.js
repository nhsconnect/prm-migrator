const http = require('https');
const URL = require('url');

exports.handler = async (event, context) => {
    const myURL = new URL.URL(process.env.url);
    const apiStage = process.env.stage;
    const pathPart = process.env.endpoint;

    const response1 = new Promise((resolve, reject) => {
        const options = {
            host: myURL.host,
            path: `${apiStage}/${pathPart}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(xmlData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`res ${res.statusCode}`);
            resolve('Success');
        });

        req.on('error', (e) => {
            reject(e.message);
        });

        var exampleEhrExtractPayload = querystring.stringify({
            'payload' : 'TestEhrExtractPayload'
        });

        req.write(exampleEhrExtractPayload);
        req.end();
    });

    const response2 = new Promise((resolve, reject) => {
        const options = {
            host: myURL.host,
            path: "/cde",
            method: 'POST'
        };

        const req = http.request(options, (res) => {
            console.log(`res ${res.statusCode}`);
            resolve('Success');
        });

        req.on('error', (e) => {
            reject(e.message);
        });

        req.write(xmlData);
        req.end();
    });

    return Promise.all([response1, response2]);
};