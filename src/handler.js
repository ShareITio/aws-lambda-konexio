const { create, list } = require("./twilio");
const { makeReturn } = require("./tools");

module.exports.default = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    if (event.httpMethod === "GET") {
      return makeReturn(await list(2), "200");
    }
    if (event.httpMethod === "POST") {
      return makeReturn(await create(event.body.body, event.body.to), "200");
    }
    return makeReturn(`Unsupported "${event.httpMethod}".`, "400");
  } catch (error) {
    console.error(error);
    return makeReturn(`An error as occured.`, "400");
  }
};
