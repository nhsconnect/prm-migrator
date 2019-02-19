const agentBuilder = require('../agentBuilder');
const AWS = require('aws-sdk-mock');

describe("Return a HTTP agent", () => {
    let agent;

    beforeAll(() => {
        process.env.PDS_PRIVATE_KEY_SSM_PARAM_NAME = "abc"
        AWS.mock('SSM', 'getParameter', "1234ABCD");
        agent = agentBuilder.getHttpAgent();
    });

    test('that the agent has the property of ca', async () => {
        expect(agent.options).toHaveProperty('ca');
    });

    test("that the agent's ca property is the expected value", async () => {
        expect(agent.options.ca).toBe('1234ABCD');
    });

    test.skip('that the agent has the property of cert', async () => {
        expect(agent).toHaveProperty('ca');
    });

    afterAll(() => {
        AWS.restore('SSM');
    });
});
