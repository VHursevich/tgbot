import TeleBot from "telebot";
import getMongoClient from './db.js';
import mongodb from 'mongodb';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', (msg) => {    
    msg.reply.photo('http://thecatapi.com/api/images/get')
    return bot.sendMessage(msg.from.id, `Здравствуfйте, ${ msg.from.first_name }!Для подтверждения вашего ТГ аккаунта нажмите "ДА", если вы не желаете авторизовываться, то нажмите кнопку "НЕТ".Вы в любое время сможете подтвердить ваш аккаунт заново.`);
});

bot.on("/env", (msg) => msg.reply.text(process.env.VERCEL_ENV));

bot.on("/db", (msg) => msg.reply.text(mongodb.connect(process.env.DB_URL).then(client => client.db().databaseName)));

bot.start();
