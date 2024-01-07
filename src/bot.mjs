import TeleBot from "telebot"
import mongo from './db.mjs'
import {ObjectId} from 'mongodb'

const bot = new TeleBot({token: process.env.TELEGRAM_BOT_TOKEN,
    usePlugins: ['commandButton', 'askUser']
});



// Secure password storage (example using a hypothetical encryption module)
const passwordHash = 'HASHED_PASSWORD'; // Replace with the hashed correct password

bot.on('/password', (msg) => {
    bot.sendMessage(msg.from.id, 'Enter password:', {
        reply_markup: {
            inline_keyboard: [[{
                text: 'Enter',
                callback_data: 'password_input'
            }]]
        }
    });

});

bot.on('callback_query', (query) => {
    if (query.data === 'password_input') {
        bot.editMessageText(query.message.chat.id, query.message.message_id, 'Please type your password:');
        bot.answerCallbackQuery(query.id); // Hide the button

        bot.on('message', (msg) => {
            if (msg.chat.id === query.message.chat.id) {
                const enteredPassword = msg.text;
                const isPasswordCorrect = validatePassword(enteredPassword); // Validate using your preferred method

                if (isPasswordCorrect) {
                    bot.sendMessage(msg.chat.id, 'Password is correct!');
                } else {
                    bot.sendMessage(msg.chat.id, 'Incorrect password. Please try again.');
                }

                bot.removeListener('message', this); // Remove the temporary message listener
            }
        });
    }
});

function validatePassword(enteredPassword) {
    // Example using a hypothetical encryption module
    const enteredPasswordHash = encryptPassword(enteredPassword);
    return enteredPasswordHash === passwordHash;
}

/*
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

    await mongo.db('test').collection('users').updateOne({username: msg .from.username}, {$set: {date: new Date()}});

    return bot.sendMessage(msg.from.id, `Пользователь ${msg.from.username} был авторизован.\nНаслаждайтесь сайтом!`);
});



bot.on("/forgetPass", (msg) => {
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

    // Set the state to expect the password input
    bot.on('text', async (msg) => {
        const newPassword = msg.text;

        if(newPassword.length > 32 || newPassword.length < 5){
            return bot.sendMessage(msg.from.id, `Пароль должен содержать 5-32 символов!`);
        }

        const user = await mongo.db('test').collection('users').updateOne({username: msg.from.username}, {$set: {password: newPassword}});

        await mongo.db('test').collection('tokens').deleteMany({user: new ObjectId(user._id)});

        return bot.sendMessage(msg.from.id, `Ваш пароль изменён, теперь можете входить в ваш аккаунт с новым паролем!\nХороших вам сочинений`);

    });
    
    
    return bot.sendMessage(msg.from.id, 'Введите ваш новый пароль размером 5-32 символов, не забывайте его снова!');
});
*/
export default bot;