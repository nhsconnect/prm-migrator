const translator = require("../main");
const given = require("./given")
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const helper = require('../dbQueryHelper');

describe("Calling lambda", () => {
  let result;
  var updateSpy = sinon.spy();

  beforeAll(() => {
    AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
    let event = given.aRecord;
    result = translator.handler(event);
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  test("it should update status to PROCESSING", async () => {
    var expectedParams = helper.changeStatusTo('PROCESSING', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("it should update status to COMPLETED", async () => {
    var expectedParams = helper.changeStatusTo('COMPLETED', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe(`<Patient><identifier><value>1234567890</value></identifier></Patient>`);
  });
});
