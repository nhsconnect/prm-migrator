const translator = require("../main");
const given = require("./given")

describe("Calling lambda", () => {
  let result;

  beforeAll(() => {
    let event = given.aRecord;
    result = translator.handler(event);
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe(`<Patient><identifier><value>1234567890</value></identifier></Patient>`);
  });
});
