import TeleBot from "telebot"
import mongo from './db.mjs'

const bot = new TeleBot({token: process.env.TELEGRAM_BOT_TOKEN,
    usePlugins: ['commandButton']
});

bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', msg => {

    // Inline keyboard markup
    const replyMarkup = bot.inlineKeyboard([
        [
            // First row with command callback button
            bot.inlineButton('Авторизация', {callback: '/authorization'}),
        
            bot.inlineButton('Забыли пароль?', {callback: '/password'})
        ],
        [
            // Second row with regular command button
            bot.inlineButton('Regular data button', {callback: '/hello'})
        ]
    ]);

    // Send message with keyboard markup
    return bot.sendMessage(msg.from.id, 'Example of command button.', {replyMarkup});

});

// Command /hello
bot.on('/hello', async msg => {
    return bot.sendMessage(msg.from.id, 'Hello!');
});

bot.on("/user", async (msg) => msg.reply.text(JSON.stringify(await fetchUsers())));

bot.on("/myuser", async (msg) => {
    return bot.sendMessage(msg.from.id, msg.from.username);
});

bot.on("/authorization", async (msg) => {

    await authorization(msg);
    return bot.sendMessage(msg.from.id, `Пользователь ${msg.from.username} был авторизован`);
});

export default bot;

async function authorization(msg){
    const user = await mongo.db('test').collection('users').findOne({username: msg.from.username});

    if(!user)
        return bot.sendMessage(msg.from.id, `Ваш username: ${msg.from.username}\n Данный username не пытался зарегистрироваться на нашем сайте`);


    await mongo.db('test').collection('users').updateOne({username: msg.from.username}, {$set: {date: new Date()}});
}

