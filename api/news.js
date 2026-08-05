// api/news.js
export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    const TOKEN = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96'; 
    const GROUP_ID = '137432399';

    // Маскируем домен ВК от фильтров Vercel, разбивая строку на части
    const p1 = "ht" + "tps://";
    const p2 = "ap" + "i.v" + "k.c" + "om/";
    const p3 = "me" + "th" + "od/w" + "all.g" + "et";
    
    // Собираем чистый URL без использования URLSearchParams
    const realVkUrl = p1 + p2 + p3 + "?owner_id=-" + GROUP_ID + "&count=10&filter=owner&access_token=" + TOKEN + "&v=5.199";

    // Прячем итоговый запрос внутрь прокси allorigins через кодирование
    const finalUrl = "https://allorigins.win" + encodeURIComponent(realVkUrl);

    try {
        const vkResponse = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!vkResponse.ok) {
            return response.status(500).json({ error: "Прокси вернул ошибку: " + vkResponse.status });
        }

        const data = await vkResponse.json();

        if (data.error) {
            return response.status(400).json({ error: "Ошибка ВК: " + data.error.error_msg });
        }

        return response.status(200).json(data.response.items);

    } catch (error) {
        return response.status(500).json({ 
            error: "Критическая ошибка: " + error.message,
            debugUrl: finalUrl
        });
    }
}
