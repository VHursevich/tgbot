import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', (msg) => {    
    msg.reply.photo('http://thecatapi.com/api/images/get')
    return bot.sendMessage(msg.from.id, `Здравствуйте, ${ msg.from.first_name }!Для подтверждения вашего ТГ аккаунта нажмите "ДА", если вы не желаете авторизовываться, то нажмите кнопку "НЕТ".Вы в любое время сможете подтвердить ваш аккаунт заново.`);
});

export default bot
