const agentBuilder = require('../agentBuilder');
const AWS = require('aws-sdk-mock');
const fs = require("fs");
const path = require("path");


describe("Return a HTTP agent", () => {
    let agent;
    let CERT_DATA;
    let CA_DATA;

    beforeAll(() => {
        process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME = "abc"
        AWS.mock('SSM', 'getParameter', "1234ABCD");
        agent = agentBuilder.getHttpsAgent();
        
        CERT_DATA = fs.readFileSync(path.resolve(__dirname + "/../tls/cert.pem")); 
        CA_DATA = fs.readFileSync(path.resolve(__dirname + "/../tls/ca.pem"))
    });

    test('that the agent has the property of ca', async () => {
        expect(agent.options).toHaveProperty('ca');
    });

    test("that the agent's ca property is the expected value", async () => {
        expect(agent.options.ca).toEqual(CA_DATA);
    });

    test('that the agent has the property of cert', async () => {
        expect(agent.options).toHaveProperty('cert');
    });

    test("that the agent's cert property is the expected value", async () => {
        expect(agent.options.cert).toEqual(CERT_DATA);
    });

    test('that the agent has the property of key', async () => {
        expect(agent.options).toHaveProperty('key');
    });

    test("that the agent's key property is the expected value", async () => {
        expect(agent.options.key).toEqual("1234ABCD");
    });

    afterAll(() => {
        AWS.restore('SSM');
    });
});

// const request = require("request-promise-native")
// const fs = require("fs")
// const path = require("path")

// const PRIVATE_KEY_DATA = process.env.PRIVATE_KEY_DATA;
// const CERT_DATA = fs.readFileSync(path.resolve(__dirname, "cert.pem"))
// const CA_DATA = fs.readFileSync(path.resolve(__dirname, "ca.pem"))
// const REQUEST_DATA = fs.readFileSync(path.resolve(__dirname, "test-request.xml"))

// jest.setTimeout(20000);

// test("That PDS responds to a valid request", async () => {
//   console.log("Cert: " + CERT_DATA.toString('utf8'))
//   console.log("Private Key Len: " + PRIVATE_KEY_DATA.length)

//   const options = {    
//     method: 'POST',
//     url: 'https://msg.opentest.hscic.gov.uk/smsp/pds',
//     agentOptions: {
//       cert: CERT_DATA,
//       key: PRIVATE_KEY_DATA,
//       ca: CA_DATA,
//     },
//     body: REQUEST_DATA,
//     headers: {
//       "Content-Type": "text/xml",
//       "SOAPAction": "urn:nhs-itk:services:201005:getNHSNumber-v1-0"
//     },
//     timeout: 5000
//   };

//   let error = null
//   let i = 0

//   for (; i < 3; ++i) {
//     try {
//       console.log("Trying to call PDS: " + i)
//       await request.post(options)

//       break
//     } catch (err) {
//       error = err
//     }
//   }

//   if (i == 3) {
//     fail("failed to call PDS (*3) " + error)
//   }
// });