const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

// Statistika
const stats = {};

// Xabar sanash
bot.on('message', (msg) => {
  if (!msg.text) return;
  if (msg.text.startsWith('/')) return;

  const userId = msg.from.id;
  const name = msg.from.first_name;

  if (!stats[userId]) {
    stats[userId] = {
      name: name,
      count: 0
    };
  }

  stats[userId].count++;
});

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 FunStat bot ishga tushdi!\n\n" +
    "📌 Bu bot guruhdagi foydalanuvchilarning xabar sonini hisoblaydi.\n" +
    "📌 /stat — guruh statistikasi\n\n" +
    "💡 Bu bot @bakhridd1n_dev tomonidan yaratildi."
  );
});

// /stat
bot.onText(/\/stat/, (msg) => {
  const chatId = msg.chat.id;

  if (Object.keys(stats).length === 0) {
    bot.sendMessage(chatId, "📊 Hali statistika yo‘q");
    return;
  }

  const sorted = Object.values(stats)
    .sort((a, b) => b.count - a.count);

  let text = "📊 *Guruh statistikasi*\n\n";

  sorted.forEach((u, i) => {
    text += (i + 1) + ". " + u.name + " — " + u.count + " ta xabar\n";
  });

  bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
});

console.log("🤖 Bot ishga tushdi...");