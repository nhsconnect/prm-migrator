const ehrExtract = require("./main");
const given = require('./given')
const sinon = require('sinon');
const AWS = require("aws-sdk-mock");

describe("ERROR responses", () => {
  let result;

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
      callback(null, Promise.reject('Oops!'));
    });
    let event = {"body": given.tpp_sample_encodedXml };
    result = await ehrExtract.handler(event);
  });

  test("That if there is an error when saving the data, it generates a ERROR response", async () => {
    expect(result.body).toBe("{\"status\":\"ERROR\"}");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});

describe("ACCEPTED responses", () => {
  let result;
  let dynamoDbPutCallCount = 0;

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      dynamoDbPutCallCount++;
      if (params.Item.PROCESS_PAYLOAD !== given.tpp_sample_json) {
        throw "Payload does not match expected";
      } 
      callback(null, {});
    });
    let event = {"body": given.tpp_sample_encodedXml};
    result = await ehrExtract.handler(event);
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("it should store data", async () => {
    expect(dynamoDbPutCallCount).toBe(1);
  });

  test("That if there is no error, it generates an ACCEPTED response", async () => {
    var jsonBody = JSON.parse(result.body);
    expect(jsonBody.status).toBe("ACCEPTED");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
