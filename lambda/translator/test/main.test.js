const translator = require("../main");

describe("Calling lambda", () => {
  let result;  

  beforeAll(() => {
    let event = {};
    result = translator.handler(event);
  });
  
  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("returns the expected body", async () => {
    expect(result.body).toBe('expected body');
  });
});
