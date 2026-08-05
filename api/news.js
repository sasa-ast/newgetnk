export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');

    const TOKEN = 'ac29061aac29061aac29061a03af6bc06faac29ac29061ac65bc87319d151a0cac0d4dc';
    const GROUP_ID = '-137432399'; 
    const VERSION = '5.199';
    const COUNT = 10; 

    const vkUrl = `https://vk.com{GROUP_ID}&count=${COUNT}&filter=owner&access_token=${TOKEN}&v=${VERSION}`;

    try {
        const vkResponse = await fetch(vkUrl);
        const data = await vkResponse.json();

        if (data.error) {
            return response.status(400).json({ error: data.error.error_msg });
        }

        return response.status(200).json(data.response.items);
    } catch (error) {
        return response.status(500).json({ error: 'Ошибка сервера при запросе к ВК' });
    }
}