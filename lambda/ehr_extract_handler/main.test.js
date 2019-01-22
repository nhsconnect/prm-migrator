const ehrExtract = require("./main");
const given = require('./given')
const AWS = require("aws-sdk-mock");
const uuid = require("uuid/v4");
const sinon = require('sinon');

class ErrorDBMock {
  constructor() {}

  put(params, callback) {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 100);
        });
      }
    };
  }
}

class DynamoDBMock {
  constructor() {}

  put(params) {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      }
    };
  }
}

describe("ERROR responses", () => {
  let result;

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
      callback(null, Promise.reject('Oops!'));
    });
    let event = {"body": { "payload": given.tpp_sample}};
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

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      callback(null, {});
    });
    let event = {"body": { "payload": given.tpp_sample}};
    result = await ehrExtract.handler(event);
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("That if there is no error, it generates an ACCEPTED response", async () => {
    var jsonBody = JSON.parse(result.body);
    expect(jsonBody.status).toBe("ACCEPTED");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
