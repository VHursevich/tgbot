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
            bot.inlineButton('Command button', {callback: '/hello'})
        ],
        [
            // Second row with regular command button
            bot.inlineButton('Regular data button', {callback: 'hello'})
        ]
    ]);

    // Send message with keyboard markup
    return bot.sendMessage(msg.from.id, 'Example of command button.', {replyMarkup});

});

// Command /hello
bot.on('/hello', msg => {
    return bot.sendMessage(msg.from.id, 'Hello!');
});

bot.on("/env", (msg) => msg.reply.text(process.env.VERCEL_ENV));

bot.on("/db", (msg) => msg.reply.text(mongo.db().databaseName));

bot.on("/user", async (msg) => msg.reply.text(JSON.stringify(await fetchUsers())));

bot.on("/myuser", async (msg) => {
    return bot.sendMessage(msg.from.id, msg.from.username);
});

export default bot

async function fetchUsers(){
    return await mongo.db('test').collection('users').findOne({username: "3130021@gmail.com"});
}

