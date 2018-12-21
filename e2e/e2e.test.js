const Url = require("url");
const request = require("request-promise-native");
const errors = require("request-promise-native/errors");

const PRM_URL = new Url.URL(process.env.PRM_ENDPOINT);

test("As a supplier, I can see my message has been accepted", async () => {
  const url = `${PRM_URL.origin}${PRM_URL.pathname}/send`;
  console.log(url);
  const response = await request.post(url, {
    resolveWithFullResponse: true
  });
  expect(response.statusCode).toBe(200);
  const { uuid, status } = JSON.parse(response.body)
  expect(uuid).toBeDefined();
  expect(status).toBe("ACCEPTED");
});
