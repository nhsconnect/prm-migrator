const translator = require("../main");
const given = require("./given")
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');

describe("Calling lambda", () => {
  let result;
  var updateSpy = sinon.spy();

  function changeStatusTo(status, uuid) {
      return {
        TableName: "PROCESS_STORAGE",
        Key: {
            "PROCESS_ID": uuid
        },
        UpdateExpression: "set PROCESS_STATUS = :p",
        ExpressionAttributeValues: {
            ":p": status,
        },
        ReturnValues: "UPDATED_NEW"
    };
  };

  beforeAll(() => {
    AWS.mock('DynamoDB.DocumentClient', 'update', updateSpy);
    let event = given.aRecord;
    result = translator.handler(event);
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  test("it should update status to PROCESSING", async () => {
    var expectedParams = changeStatusTo('PROCESSING', '101');
    expect(updateSpy.calledWith(expectedParams)).toBeTruthy();
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe(`<Patient><identifier><value>1234567890</value></identifier></Patient>`);
  });
});
