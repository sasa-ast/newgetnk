// api/news.js
export default async function handler(request, response) {
    // Включаем CORS-заголовки, чтобы браузер не блокировал запрос
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Твои данные для авторизации
    const TOKEN = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96'; 
    const GROUP_ID = '-137432399'; // Вводи сюда ТОЛЬКО ЦИФРЫ (БЕЗ минуса!)
    const VERSION = '5.199';
    const COUNT = 10; 

    // Формируем безопасный URL (минус перед ID группы подставляется автоматически здесь)
    const vkUrl = `https://vk.ru{GROUP_ID}&count=${COUNT}&filter=owner&access_token=${TOKEN}&v=${VERSION}`;

    try {
        // Делаем запрос с обязательным указанием User-Agent, иначе облако Vercel блокируется серверами ВК
        const vkResponse = await fetch(vkUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        // Проверяем, ответил ли сам сервер VK
        if (!vkResponse.ok) {
            return response.status(500).json({ 
                error: `Сервер ВКонтакте ответил со статусом: ${vkResponse.status}` 
            });
        }

        const data = await vkResponse.json();

        // Проверяем внутренние ошибки безопасности VK API (например, неверный токен или закрытая группа)
        if (data.error) {
            return response.status(400).json({ 
                error: `Ошибка VK API: ${data.error.error_msg}`,
                code: data.error.error_code
            });
        }

        // Проверяем, пришли ли вообще посты
        if (!data.response || !data.response.items) {
            return response.status(404).json({ 
                error: 'ВКонтакте вернул пустой ответ или структура данных изменилась' 
            });
        }

        // Если всё отлично — отдаем массив новостей твоему фронтенду
        return response.status(200).json(data.response.items);

    } catch (error) {
        // Перехватываем любые критические падения сервера (например, таймаут соединения)
        return response.status(500).json({ 
            error: `Критическая ошибка бэкенда: ${error.message}` 
        });
    }
}
