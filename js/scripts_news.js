// js/news.js

// 1. Эта функция ПРИНИМАЕТ данные от ВК
window.parseVkNews = function(data) {
    console.log("Данные от ВК успешно получены:", data); // Проверим в консоли F12
    
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    if (data.error) {
        newsContainer.innerHTML = '<p>Ошибка VK: ' + data.error.error_msg + '</p>';
        return;
    }

    const posts = data.response.items;
    newsContainer.innerHTML = ''; // Стираем "Загрузка..."

    posts.forEach(post => {
        if (!post.text && !post.attachments) return;

        const postDate = new Date(post.date * 1000).toLocaleDateString('ru-RU');

        // Ищем картинку
        let imageUrl = '';
        if (post.attachments) {
            const photo = post.attachments.find(att => att.type === 'photo');
            if (photo) {
                imageUrl = photo.photo.sizes[photo.photo.sizes.length - 1].url;
            }
        }

        // Создаем карточку
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="Новость" class="news-img">` : ''}
            <div class="news-content">
                <span class="news-date">${postDate}</span>
                <p class="news-text">${post.text || 'Фотоотчет'}</p> 
                <a href="https://vk.com{post.owner_id}_${post.id}" target="_blank" class="news-link">Читать в VK</a>
            </div>
        `;
        newsContainer.appendChild(card);
    });
};

// 2. Эта функцияОТПРАВЛЯЕТ запрос в ВК
function loadVkNewsJSONP() {
    const token = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96';
    const groupId = '137432399';

    // Разбиваем адрес на безопасные части, чтобы ни один символ не стерся
    const protocol = "https://";
    const domain = "://vk.com";
    const path = "/method/wall.get";
    
    // Собираем параметры
    const params = "?owner_id=-" + groupId + "&count=10&filter=owner&access_token=" + token + "&v=5.199&callback=parseVkNews";

    // Склеиваем всё вместе строго по порядку
    const url = protocol + domain + path + params;

    console.log("Запускаем запрос к адресу:", url);

    const script = document.createElement('script');
    script.src = url;
    
    script.onerror = function() {
        console.error("Сбой сети! Не удалось загрузить скрипт ВК.");
        const container = document.getElementById('news-container');
        if (container) container.innerHTML = '<p>Сбой сети. Проверьте подключение или VPN.</p>';
    };

    document.body.appendChild(script);
}

