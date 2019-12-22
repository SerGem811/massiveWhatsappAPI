"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  hook: async ctx => {
    let event = ctx.request.body;

    if (event.type === "message" && event.data.body && !event.data.fromMe) {
      let message = event.data.body;

      let knexQueryBuilder = strapi.connections.default;
      let v_messages = await knexQueryBuilder.raw(
        "SELECT * FROM responsewapps order by 'order' asc;"
      );

	console.log(v_messages)

	if (v_messages[0]) {
      var finded = v_messages[0].find(obj => {
               if (message.toUpperCase() === obj.message.toUpperCase()) {
           	return obj
          } 
      });

	if (finded) {
		sendMsg(event, finded)
	} 

	}
    }
  },
  setApiToken: () => {

  }
};


async function sendMsg(event, obj) {
  var request = require("request");
  let user = await strapi.services.senderdata.findOne({id:1});
 console.log('entra')
var options = {
    method: "POST",
    url: "https://api.mercury.chat/sdk/whatsapp/sendMessage",
    qs: {
      api_token: user.apitoken,
      instance: event.data.instance_number
    },
    headers: {
      "cache-control": "no-cache",
      Connection: "keep-alive",
      Accept: "*/*",
      "User-Agent": "PostmanRuntime/7.20.1",
      "Content-Type": "application/json"
    },
    body: { body: obj.response, phone: event.data.author.split("@")[0] },
    json: true
  };

  console.log(event);
  console.log(obj.response);
  console.log(event.data.author.split("@")[0]);

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}
