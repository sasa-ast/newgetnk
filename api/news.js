// api/news.js
export default async function handler(request, response) {
    // Включаем CORS-заголовки
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 1. ТВОИ ДАННЫЕ ДЛЯ АВТОРИЗАЦИИ
    const TOKEN = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96'; 
    const GROUP_ID = '137432399'; // Твой ID группы предприятия
    const VERSION = '5.199';
    const COUNT = '10'; 

    // 2. БЕЗОПАСНАЯ СБОРКА АДРЕСА ПО КУСОЧКАМ (чтобы ничего не потерялось)
    const base = "https://vk.com";
    const params = "?owner_id=-" + GROUP_ID + "&count=" + COUNT + "&filter=owner&access_token=" + TOKEN + "&v=" + VERSION;
    
    // Итоговый полный URL
    const vkUrl = base + params;

    try {
        const vkResponse = await fetch(vkUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!vkResponse.ok) {
            return response.status(500).json({ 
                error: "Сервер ВКонтакте ответил со статусом: " + vkResponse.status 
            });
        }

        const data = await vkResponse.json();

        // Проверяем ошибки самого ВК (неверный токен, закрытая группа и т.д.)
        if (data.error) {
            return response.status(400).json({ 
                error: "Ошибка VK API: " + data.error.error_msg,
                code: data.error.error_code
            });
        }

        if (!data.response || !data.response.items) {
            return response.status(404).json({ 
                error: "ВКонтакте вернул пустой ответ или структура данных изменилась" 
            });
        }

        // Если всё супер — отдаем массив новостей фронтенду
        return response.status(200).json(data.response.items);

    } catch (error) {
        // Если упал сам сервер — выводим URL, который мы собрали, чтобы проверить его глазами
        return response.status(500).json({ 
            error: "Критическая ошибка бэкенда: " + error.message,
            attemptedUrl: vkUrl
        });
    }
}
