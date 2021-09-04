require("dotenv").config();
const express = require("express");
const server = express();
const weather = require("weather-js");
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME;

server.get("/", (req, res) => {
  res.sendStatus(200);
});

function callMySelf() {
  fetch(`https://${APP_NAME}/`);

  setInterval(() => {
    callMySelf();
  }, 1e3 * 300);
}

callMySelf();

server.listen(PORT, () => {
  console.log("Server has been started on port ", PORT);
});

const bot = new Telegraf(process.env.BOT_TOKEN); 
bot.start((ctx) =>
  ctx.reply(
    `Welcome, ${ctx.message.from.first_name}!\n\nFind out the weather in your city (and get a disney picture as a gift 🎁)`
  )
); 
bot.help((ctx) =>
  ctx.reply(
    "Write the city you want to know weather in\n\n(Available only in English)"
  )
); 
bot.on("text", async (ctx) => {
  const response = await fetch("https://api.disneyapi.dev/characters");
  const data = await response.json();
  const random = Math.floor(Math.random() * data.data.length);

  weather.find(
    { search: `${ctx.message.text}`, degreeType: "C" },
    function (err, result) {
      try {
        ctx.reply(
          `Weather in ${ctx.message.text} today 🕵🌏:\n${result[0].current.skytext} ${result[0].current.temperature} °C ( feels like ${result[0].current.feelslike} °C)\n\nTomorrow 🔮:\n${result[0].forecast[2].skytextday} ${result[0].forecast[2].low} °C\n\n\nDisney pic for you 🧚‍♀️✨:\n\n${data.data[random].name}\n${data.data[random].imageUrl}`
        );
      } catch (e) {
        ctx.reply(
          `${"https://cs11.pikabu.ru/post_img/2020/05/11/11/1589224804142471795.jpg"}\n\n\nTo get instructions enter /help`
        );
      }
    }
  );
}); 
bot.hears("/start", (ctx) =>
  ctx.reply(
    `Welcome, ${ctx.message.from.first_name}!\n\nFind out the weather in your city (and get a disney picture as a gift 🎁)`
  )
); 
bot.launch(); 
