import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from 'grammy';
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
  { command: 'my_mood', description: 'Спроси у меня про настроение' },
  { command: 'mood_assessment', description: 'Оцени мое настроение' },
  { command: 'share', description: 'Поделиться данными' },
]);

//Hears
bot.hears(['пинг', 'Пинг'], async (ctx) => {
  await ctx.reply('понг');
});

bot.hears(/пипец/, async (ctx) => {
  await ctx.reply('Ругаемся?');
});

bot.hears('ID', async (ctx) => {
  await ctx.reply(`Ваш telegram ID: ${ctx.from!.id}`);
});

bot.hears('Хорошо', async (ctx) => {
  await ctx.reply('Рад слышать!', {
    reply_markup: { remove_keyboard: true },
  });
});

bot.hears('Плохо', async (ctx) => {
  await ctx.reply('Мне очень жаль!', {
    reply_markup: { remove_keyboard: true },
  });
});

// bot.on(
//   'message',
//   async (ctx) =>
//     await ctx.reply('Привет', {
//       reply_parameters: { message_id: ctx.msg.message_id },
//     })
// );

//Different types of messages
bot.on('message:photo', (ctx) => ctx.reply('Ваше сообщение содержит фото'));
bot.on('message::url', (ctx) => ctx.reply('Ваше сообщение содержит url'));
bot.on('::email', (ctx) => ctx.reply('Ваше сообщение содержит email'));
//bot.on('message:text', (ctx) => ctx.reply('Получил сообщение с текстом'));
bot.on(':location', async (ctx) => {
  await ctx.reply('Спасибо за геолокацию!');
});
bot.on(':contact', async (ctx) => {
  await ctx.reply('Спасибо за контакт!');
});

// Errors
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

// Keyboard
const moodKeyboard = new Keyboard()
  .text('Хорошо')
  .row()
  .text('Нормально')
  .row()
  .text('Плохо')
  .resized()
  .oneTime();

const moodLabels = ['Хорошо', 'Нормально', 'Плохо'];
const rows = moodLabels.map((label) => [Keyboard.text(label)]);
const moodKeyboard2 = Keyboard.from(rows).resized().oneTime();

bot.command('my_mood', async (ctx) => {
  await ctx.reply('Как настроение?', {
    reply_markup: moodKeyboard2,
  });
});

const shareKeyboard = new Keyboard()
  .requestLocation('Геолокация')
  .requestContact('Контакт')
  .requestPoll('Опрос')
  .placeholder('Я хочу поделиться...')
  .resized();

bot.command('share', async (ctx) => {
  await ctx.reply('Какими данными хочешь поделиться?', {
    reply_markup: shareKeyboard,
  });
});

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
//const rowsInline = numbers.map((num) => [InlineKeyboard.text(num.toString())]);
//const inlineKeyboard = InlineKeyboard.from(rowsInline);
const inlineKeyboard = new InlineKeyboard()
  .text('1', 'button-1')
  .text('2', 'button-2')
  .text('3', 'button-3')
  .text('4', 'button-4')
  .text('5', 'button-5');

bot.command('mood_assessment', async (ctx) => {
  await ctx.reply('Оцените ваше настроение от 1 до 5', {
    reply_markup: inlineKeyboard,
  });
});

// bot.callbackQuery('button-1', async (ctx) => { 
//     await ctx.reply('Выбрана цифра 1');
// });
// bot.callbackQuery('button-2', async (ctx) => { 
//     await ctx.answerCallbackQuery({
//         text: 'Выбрана цифра 2',
//     });
//     await ctx.answerCallbackQuery();
// });
// bot.callbackQuery('button-3', async (ctx) => { 
//     await ctx.reply('Выбрана цифра 3');
//     await ctx.answerCallbackQuery({ text: "Ответ принят!" });
// });
bot.on('callback_query:data', async (ctx) => {
    await ctx.reply(`Нажата кнопка ${ctx.callbackQuery.data}`);
    await ctx.answerCallbackQuery();
});

bot.start();
