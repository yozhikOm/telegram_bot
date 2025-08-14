import { Bot } from "grammy";
import 'dotenv/config';

const BOT_API_KEY = process.env.BOT_API_KEY;
if (!BOT_API_KEY) {
  throw new Error("Переменная окружения BOT_API_KEY не задана!");
}

const bot = new Bot (BOT_API_KEY);

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();