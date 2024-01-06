import TeleBot from "telebot"
import mongo from './db.mjs'

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN, ['commandButton']);

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


export default bot

async function fetchUsers(){
    return await mongo.db('test').collection('users').findOne({username: "3130021@gmail.com"});
}

