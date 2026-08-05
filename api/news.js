// api/news.js
export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');

    const TOKEN = '0f0704400f0704400f0704405d0c45c2ff00f070f0704406575e6b37eb57d7c630a3ce9'; 
    const GROUP_ID = '-137432399'; // Убедись, что тут твой ID С МИНУСОМ!
    const VERSION = '5.199';
    const COUNT = 10; 

    const vkUrl = `https://vk.com{GROUP_ID}&count=${COUNT}&filter=owner&access_token=${TOKEN}&v=${VERSION}`;

    try {
        // Добавляем User-Agent, чтобы ВК не блокировал облачный сервер Vercel
        const vkResponse = await fetch(vkUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = await vkResponse.json();

        // Если ВК вернул внутреннюю ошибку (например, неверный токен)
        if (data.error) {
            return response.status(400).json({ error: `Ошибка VK API: ${data.error.error_msg} (Код: ${data.error.error_code})` });
        }

        return response.status(200).json(data.response.items);
    } catch (error) {
        // Если упал сам сервер
        return response.status(500).json({ error: `Ошибка сервера: ${error.message}` });
    }
}
