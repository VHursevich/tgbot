import TeleBot from "telebot"
import mongo from './db.js'

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', (msg) => {    
    msg.reply.photo('http://thecatapi.com/api/images/get')
    return bot.sendMessage(msg.from.id, `Здравствуйте, ${ msg.from.first_name }!Для подтверждения вашего ТГ аккаунта нажмите "ДА", если вы не желаете авторизовываться, то нажмите кнопку "НЕТ".Вы в любое время сможете подтвердить ваш аккаунт заново.`);
});

bot.on("/env", (msg) => msg.reply.text(process.env.VERCEL_ENV));

bot.on("/db", (msg) => msg.reply.text(mongo.db().databaseName));

export default bot
