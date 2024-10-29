import re
from telegram import Update, ChatPermissions
from telegram.ext import Updater, MessageHandler, Filters, CallbackContext

# Укажите ваш токен бота
TOKEN = "7460356226:AAFBod31cHu_FxpBa9AwiQS0xkVnPEDUYnM"

# Список запрещенных фраз
FORBIDDEN_PHRASES = [
    "Легкий заработок", "Дистанционный заработок", "Онлайн заработок",
    "Удаленный заработок", "Схема заработка", "Схемы заработка", 
    "Пассивный заработок", "Интересно?", "Открыт набор", "Удаленная сфера",
    "заработка", "Дневная выручка", "Стабильна прибыль", "Пассивный доход",
    "Доп доход", "График гибкий", "удаленное сотрудничество", "Ищем партнеров",
    "Ищу партнеров", "Опыт необязателен", "Строго с 18 лет", "хорошим доходом",
    "хороший доход", "Занятость", "Пишите + в ЛС"
]

# Регулярное выражение для поиска фраз с числовым заработком, например:
# "100$ в день", "200 длр в день", "от 100$ в день", "от 200 длр в день"
AMOUNT_REGEX = r"\b(?:от\s*)?(\d+)\s*(\$|длр)\s*(в\s*день)?\b"

# Сообщение о причине бана
BAN_REASON = "Реклама сторонних ресурсов и схем заработок запрещена."

def check_message(update: Update, context: CallbackContext):
    message_text = update.message.text
    user = update.message.from_user

    # Проверка на запрещенные фразы или соответствие регулярному выражению
    if any(phrase.lower() in message_text.lower() for phrase in FORBIDDEN_PHRASES) or re.search(AMOUNT_REGEX, message_text, re.IGNORECASE):
        chat_id = update.message.chat_id
        user_id = user.id
        
        # Бан пользователя
        context.bot.kick_chat_member(chat_id, user_id)
        
        # Уведомление о бане
        update.message.reply_text(f"{user.first_name} был забанен. {BAN_REASON}")

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    # Обработчик сообщений
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, check_message))

    # Запуск бота
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
