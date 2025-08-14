import { Bot, GrammyError, HttpError } from 'grammy';
import 'dotenv/config';

const BOT_API_KEY = process.env.BOT_API_KEY;
if (!BOT_API_KEY) {
  throw new Error('Переменная окружения BOT_API_KEY не задана!');
}

const bot = new Bot(BOT_API_KEY);

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
// Handle the /hello command.
bot.command('hello', (ctx) => ctx.reply('Hello!'));

// Menu
bot.api.setMyCommands([
{ command: 'start', description: 'Запуск бота' },
{ command: 'hello', description: 'Получить приветствие' },
]);

// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Got another message!'));

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const error = err.error;
  if (error instanceof GrammyError) {
    console.error('Error in request:', error.description);
  } else if (error instanceof HttpError) {
    console.error('Could not contact Telegram:', error);
  } else {
    console.error('Unknown error:', error);
  }
});

bot.start();
