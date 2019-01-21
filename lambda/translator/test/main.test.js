const translator = require("../main");
const given = require("./given")
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const dbQueryHelper = require('../dbQueryHelper');
const EasyXml = require('easyxml');

describe("Calling lambda", () => {
  let result;
  var updateSpy = sinon.spy();

  beforeAll(() => {
    AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
    let event = { "Records": [given.aNewRecord]};
    result = translator.handler(event);
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  test("it should update the status to PROCESSING", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('PROCESSING', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update the payload with transformed xml", async () => {
    var patientPayloadXmlOptions = {
      rootElement: 'Patient',
      manifest: true,
    };
    
    let xmlSerializer = new EasyXml(patientPayloadXmlOptions);

    let payload = {
        identifier: {
            value: '1234567890'
        }
    };

    var expectedParams = dbQueryHelper.changePayloadTo(xmlSerializer.render(payload), '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update status to COMPLETED", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe('');
  });
});
