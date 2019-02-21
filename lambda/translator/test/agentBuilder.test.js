const agentBuilder = require('../agentBuilder');
const AWS = require('aws-sdk-mock');
const fs = require("fs");
const path = require("path");


describe("Return a HTTP agent", () => {
    let agent;
    let CERT_DATA;
    let CA_DATA;

    beforeAll(async () => {
        process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME = "abc"
        AWS.mock('SSM', 'getParameter', { Parameter: { Value: "1234ABCD"}});
        agent = await agentBuilder.getHttpsAgent();
        
        CERT_DATA = fs.readFileSync(path.resolve(__dirname + "/../tls/cert.pem")); 
        CA_DATA = fs.readFileSync(path.resolve(__dirname + "/../tls/ca.pem"))
    });

    test('that the agent has the property of ca', async () => {
        expect(agent).toHaveProperty('ca');
    });

    test("that the agent's ca property is the expected value", async () => {
        expect(agent.ca).toEqual(CA_DATA);
    });

    test('that the agent has the property of cert', async () => {
        expect(agent).toHaveProperty('cert');
    });

    test("that the agent's cert property is the expected value", async () => {
        expect(agent.cert).toEqual(CERT_DATA);
    });

    test('that the agent has the property of key', async () => {
        expect(agent).toHaveProperty('key');
    });

    test("that the agent's key property is the expected value", async () => {
        expect(agent.key).toEqual("1234ABCD");
    });

    afterAll(() => {
        AWS.restore('SSM');
    });
});