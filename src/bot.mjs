import TeleBot from "telebot"
import mongo from './db.mjs'
import {ObjectId} from 'mongodb'

const bot = new TeleBot({token: process.env.TELEGRAM_BOT_TOKEN,
    usePlugins: ['commandButton', 'askUser']
});

// Define a regular expression pattern for the password command
const passwordCommand = /^\/password$/;

// Event listener for incoming messages
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Check if the message matches the password command
  if (passwordCommand.test(text)) {
    // Ask the user for a password
    bot.sendMessage(chatId, 'Please enter your password:', {ask: 'password'});
  }
});

// Event listener for password input
bot.on('ask.password', (msg) => {
  const chatId = msg.chat.id;
  const password = msg.text;

  // Process the password (you can add your validation logic here)
  // For example, you can check if the password meets certain criteria

  // Respond to the user
  bot.sendMessage(chatId, `You entered the password: ${password}`);
});

export default bot;