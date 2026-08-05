// js/news.js

// 1. Глобальная функция, которую вызовет ВКонтакте, когда пришлет новости
window.parseVkNews = function(data) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    // Проверяем, нет ли ошибки от ВК
    if (data.error) {
        console.error("Ошибка ВК:", data.error.error_msg);
        newsContainer.innerHTML = '<p>Не удалось загрузить новости предприятия.</p>';
        return;
    }

    const posts = data.response.items;
    newsContainer.innerHTML = ''; // Очищаем контейнер от текста "Загрузка..."

    // Перебираем посты и строим твои карточки
    posts.forEach(post => {
        // Пропускаем посты, если в них нет ни текста, ни вложений
        if (!post.text && !post.attachments) return;

        const postDate = new Date(post.date * 1000).toLocaleDateString('ru-RU');

        // Ищем картинку в посте
        let imageUrl = '';
        if (post.attachments) {
            const photoAttachment = post.attachments.find(att => att.type === 'photo');
            if (photoAttachment) {
                const sizes = photoAttachment.photo.sizes;
                imageUrl = sizes[sizes.length - 1].url; // Самая крупная картинка
            }
        }

        // Создаем HTML-карточку новости в твоем фирменном стиле
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="Новость" class="news-img">` : ''}
            <div class="news-content">
                <span class="news-date">${postDate}</span>
                <p class="news-text">${post.text ? post.text.substring(0, 200) + '...' : 'Фотоотчет'}</p> 
                <a href="https://vk.com{post.owner_id}_${post.id}" target="_blank" class="news-link">Читать в VK</a>
            </div>
        `;
        
        newsContainer.appendChild(card);
    });
};

// 2. Функция, которая запрашивает данные у ВК через технологию JSONP
function loadVkNewsJSONP() {
    const TOKEN = '49e5481149e5481149e54811dd4aa78ec2449e549e548112397aef0d3149a1a1f131e96';
    const GROUP_ID = '137432399';
    
    // Формируем ссылку. Обрати внимание на параметр callback=parseVkNews в конце!
    // Он заставляет ВК обернуть ответ в функцию, которую мы создали выше
    const url = "https://vk.com/" + GROUP_ID + "&count=10&filter=owner&access_token=" + TOKEN + "&v=5.199&callback=parseVkNews";

    // Создаем невидимый тег <script> и вставляем его в HTML. 
    // Это обходит любые блокировки CORS и ограничения серверов Vercel!
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

// Запускаем загрузку сразу после готовности страницы
document.addEventListener('DOMContentLoaded', loadVkNewsJSONP);
