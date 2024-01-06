import TeleBot from "telebot"
import mongo from './db.mjs'

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Inline buttons
bot.on('/inlineKeyboard', msg => {

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('callback', {callback: 'this_is_data'}),
            bot.inlineButton('inline', {inline: 'some query'})
        ], [
            bot.inlineButton('url', {url: 'https://telegram.org'})
        ]
    ]);

    return bot.sendMessage(msg.from.id, 'Inline keyboard example.', {replyMarkup});

});

// Inline button callback
bot.on('this_is_data', msg => {
    // User message alert
    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);
});


bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', (msg) => {    
    msg.reply.photo('http://thecatapi.com/api/images/get')
    return bot.sendMessage(msg.from.id, `Здравствуйте, ${ msg.from.first_name }!Для подтверждения вашего ТГ аккаунта нажмите "ДА", если вы не желаете авторизовываться, то нажмите кнопку "НЕТ".Вы в любое время сможете подтвердить ваш аккаунт заново.`);
});

bot.on("/env", (msg) => msg.reply.text(process.env.VERCEL_ENV));

bot.on("/db", (msg) => msg.reply.text(mongo.db().databaseName));

bot.on("/user", async (msg) => msg.reply.text(JSON.stringify(await fetchUsers())));


export default bot

async function fetchUsers(){
    return await mongo.db('test').collection('users').findOne({username: "3130021@gmail.com"});
}

