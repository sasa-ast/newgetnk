// api/news.js
export default async function handler(request, response) {
    // Включаем правильные CORS заголовки
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    // ТВОИ ДАННЫЕ ДЛЯ АВТОРИЗАЦИИ (Проверь их внимательно)
    const TOKEN = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96'; 
    const GROUP_ID = '137432399'; // Только цифры группы, без минуса

    // Официальный базовый адрес API ВКонтакте
    const baseUrl = "https://vk.com";

    // Безопасно упаковываем параметры запроса через встроенный объект Node.js.
    // Это исключает любые ошибки парсинга строки на хостинге Vercel!
    const queryParams = new URLSearchParams({
        owner_id: `-${GROUP_ID}`, // Минус подставится строго перед ID
        count: '10',
        filter: 'owner',
        access_token: TOKEN,
        v: '5.199'
    });

    // Соединяем базовый адрес и параметры через знак вопроса
    const vkUrl = `${baseUrl}?${queryParams.toString()}`;

    try {
        const vkResponse = await fetch(vkUrl, {
            method: 'GET',
            headers: {
                // Маскируемся под обычный браузер, чтобы ВК не выдавал заглушку "браузер устарел"
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!vkResponse.ok) {
            return response.status(500).json({ 
                error: `Сервер ВКонтакте вернул сетевую ошибку: ${vkResponse.status}` 
            });
        }

        const data = await vkResponse.json();

        // Если ВК прислал понятную ошибку (например, неверный токен)
        if (data.error) {
            return response.status(400).json({ 
                error: `Ответ от VK API с ошибкой: ${data.error.error_msg}`,
                code: data.error.error_code
            });
        }

        // Если всё прошло успешно — отправляем массив постов на фронтенд
        return response.status(200).json(data.response.items);

    } catch (error) {
        // Если что-то упадет, мы увидим чистую системную ошибку и точный URL без искажений
        return response.status(500).json({ 
            error: `Критический сбой функции Vercel: ${error.message}`,
            generatedUrl: vkUrl
        });
    }
}
