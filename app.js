const TelegramBot = require('node-telegram-bot-api');

// Укажите ваш токен бота
const TOKEN = '7460356226:AAFBod31cHu_FxpBa9AwiQS0xkVnPEDUYnM';
const bot = new TelegramBot(TOKEN, { polling: true });

// Список запрещенных фраз
const FORBIDDEN_PHRASES = [
    "Легкий заработок", "Дистанционный заработок", "Онлайн заработок",
    "Удаленный заработок", "Схема заработка", "Схемы заработка", 
    "Пассивный заработок", "Интересно?", "Открыт набор", "Удаленная сфера",
    "заработка", "Дневная выручка", "Стабильна прибыль", "Пассивный доход",
    "Доп доход", "График гибкий", "удаленное сотрудничество", "Ищем партнеров",
    "Ищу партнеров", "Опыт необязателен", "Строго с 18 лет", "хорошим доходом",
    "хороший доход", "Занятость", "Пишите + в ЛС", "Удаленно", "от 18 лет", "с 18 лет"
];

// Регулярное выражение для поиска фраз с числовым заработком
const AMOUNT_REGEX = /\b(?:от\s*|до\s*)?(\d+)\s*(\$|долларов|длр)\s*(в\s*день)?\b/i;

// Сообщение о причине бана
const BAN_REASON = "Реклама сторонних ресурсов и схем заработок запрещена.";

// Функция для проверки сообщения
function checkMessage(msg) {
    const messageText = msg.text || '';
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    // Проверка на запрещенные фразы и совпадение по регулярному выражению
    const hasForbiddenPhrase = FORBIDDEN_PHRASES.some(phrase => messageText.toLowerCase().includes(phrase.toLowerCase()));
    const matchesAmountRegex = AMOUNT_REGEX.test(messageText);

    if (hasForbiddenPhrase || matchesAmountRegex) {
        // Блокировка пользователя
        bot.kickChatMember(chatId, userId).then(() => {
            // Сообщение о причине бана
            bot.sendMessage(chatId, `${msg.from.first_name} был забанен. ${BAN_REASON}`);
        }).catch(error => {
            console.error("Ошибка при блокировке пользователя:", error);
        });
    }
}

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
    checkMessage(msg);
});
