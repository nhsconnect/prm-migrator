const translator = require("../translate");
const given = require("./given")
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const dbQueryHelper = require('../dbQueryHelper');
const EasyXml = require('easyxml');

describe("When Translator is given an event", () => {

  test("it should translate the payload into a FHIR profile", async () => {

    let payload = {
      patient: {
        identifier: {
          value: '3474710087'
        }
      }
    };

    expect(translator.translate(given.aNewRecord)).toEqual(payload);
  });
});
