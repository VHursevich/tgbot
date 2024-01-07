import TeleBot from "telebot"
import mongo from './db.mjs'

const bot = new TeleBot({token: process.env.TELEGRAM_BOT_TOKEN,
    usePlugins: ['commandButton', 'askUser']
});

bot.on("text", msg => msg.text.startsWith('/')?null:msg.reply.text(msg.text));

bot.on('/start', msg => {
    // Inline keyboard markup
    const startButtons = bot.inlineKeyboard([
        [
            // First row with command callback button
            bot.inlineButton('Авторизация', {callback: '/askPermission'}),
        
            bot.inlineButton('Забыли пароль?', {callback: '/forgetPass'})
        ],
        [
            // Second row with regular command button
            bot.inlineButton('Скажи "Привет"', {callback: '/hello'})
        ]
    ]);

    // Send message with keyboard markup
    return bot.sendMessage(msg.from.id, `Здравствуйте, ${msg.from.username}, что вы хотите сделать?`, {replyMarkup: startButtons});

});

bot.on("/hello", (msg) => {
    return bot.sendMessage(msg.from.id, "Привет!");
});

bot.on("/askPermission", (msg) => {
    const askPerButtons = bot.inlineKeyboard([
        [
            bot.inlineButton('Да, я хочу авторизоваться!', {callback: '/authorization'}),
        ],
    
        [
            bot.inlineButton('Нет, я пока не хочу авторизовываться!', {callback: '/answerNo'}),
        ]
    ]);

    return bot.sendMessage(msg.from.id, `Проверьте ваш username "${msg.from.username}"\nЕсли username верный и вы желаете авторизовать ваш аккаунт на сайте, то нажмите "Да", в ином случае "Нет"`, {replyMarkup: askPerButtons});
});

bot.on("/answerNo", (msg) => {
    return bot.sendMessage(msg.from.id, "Если вы захотите авторизоваться или обновить пароль при потере, то обращайтесь.\nХорошего дня!");
});

bot.on("/authorization", async (msg) => {
    const user = await mongo.db('test').collection('users').findOne({username: msg.from.username});

    if(!user)
        return bot.sendMessage(msg.from.id, `Ваш username: ${msg.from.username}\nДанный username не пытался зарегистрироваться на нашем сайте`);

    if(user.date.getTime() != new Date(0).getTime()){
        return bot.sendMessage(msg.from.id, `Вы уже были авторизованы на нашем сайте, наслаждайтесь сочинениями!`);
    }

    await mong.db('test').collection('users').updateOne({username: msg .from.username}, {$set: {date: new Date()}});

    return bot.sendMessage(msg.from.id, `Пользователь ${msg.from.username} был авторизован.\nНаслаждайтесь сайтом!`);
});

bot.on("/forgetPass", async (msg) => {
    const changePassButtons = bot.inlineKeyboard([
        [
            bot.inlineButton('Да, я хочу сменить пароль!', {callback: '/changePass'}),
        ],
    
        [
            bot.inlineButton('Нет, я не хочу менять пароль!', {callback: '/answerNo'}),
        ]
    ]);

    return bot.sendMessage(msg.from.id, `Чтобы сменить пароль нажмите "Новый пароль", в противном случае "Я не хочу менять пароль!"`, {replyMarkup: changePassButtons});
});

bot.on("/changePass", async (msg) => {
    const user = await mongo.db('test').collection('users').findOne({username: msg.from.username});

    if(!user)
        return bot.sendMessage(msg.from.id, `Ваш username: ${msg.from.username}\nДанный username не был зарегистрирован на сайте`);

    if(user.date.getTime() != new Date(0).getTime()){
        return bot.sendMessage(msg.from.id, `Вы уже были авторизованы на нашем сайте, наслаждайтесь сочинениями!`);
    }

    await mongo.db('test').collection('users').updateOne({username: msg .from.username}, {$set: {date: new Date()}});

    return bot.sendMessage(msg.from.id, `Пользователь ${msg.from.username} был авторизован.\nНаслаждайтесь сайтом!`);
});










// On start command
bot.on('/test', msg => {

    const id = msg.from.id;

    // Ask user name
    return bot.sendMessage(id, 'What is your name?', {ask: 'name'});

});

// Ask name event
bot.on('ask.name', msg => {

    const id = msg.from.id;
    const name = msg.text;

    // Ask user age
    return bot.sendMessage(id, `Nice to meet you, ${ name }! How old are you?`, {ask: 'age'});

});

// Ask age event
bot.on('ask.age', msg => {

    const id = msg.from.id;
    const age = Number(msg.text);

    if (!age) {

        // If incorrect age, ask again
        return bot.sendMessage(id, 'Incorrect age. Please, try again!', {ask: 'age'});

    } else {

        // Last message (don't ask)
        return bot.sendMessage(id, `You are ${ age } years old. Great!`);

    }

});


export default bot;
