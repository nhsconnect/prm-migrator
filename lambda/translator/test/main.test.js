const translator = require("../main");
const given = require("./given")
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const dbQueryHelper = require('../dbQueryHelper');

describe("Calling lambda", () => {
  let result;
  var updateSpy = sinon.spy();

  beforeAll(() => {
    AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
    let event = given.twoNewRecords;
    result = translator.handler(event);
  });

  test("it should update status of the first record to COMPLETED", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update status of the second record to COMPLETED", async () => {
    var expectedParams = dbQueryHelper.changeStatusTo('COMPLETED', '102');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe('');
  });
  
  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
