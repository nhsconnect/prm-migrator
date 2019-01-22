const translator = require("../translator");
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
    result = translator.translate(given.aNewRecord);
  });

  test("it should update the status to PROCESSING", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('PROCESSING', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update the payload with transformed xml", async () => {

    let payload = {
      patient: {
        identifier: {
          value: '3474710087'
        }
      }
    };

    var expectedParams = dbQueryHelper.changePayloadTo(payload, '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update status to COMPLETED", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
