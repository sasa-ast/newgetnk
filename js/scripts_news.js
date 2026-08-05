// Функция для загрузки новостей
async function loadNews() {
    const newsContainer = document.getElementById('news-container'); // Блок в HTML, куда вставим новости
    
    try {
        // Делаем запрос к нашей Serverless-функции
        const response = await fetch('/api/news');
        const posts = await response.json();

        if (!response.ok) throw new Error(posts.error || 'Ошибка загрузки');

        // Очищаем контейнер от текста "Загрузка..."
        newsContainer.innerHTML = '';

        // Пробегаемся по каждому посту и создаем HTML-карточку
        posts.forEach(post => {
            // Пропускаем пустые посты без текста
            if (!post.text) return; 

            // Переводим дату из формата Unix в читаемый вид
            const postDate = new Date(post.date * 1000).toLocaleDateString('ru-RU');

            // Ищем картинку в посте, если она есть
            let imageUrl = '';
            if (post.attachments) {
                const photoAttachment = post.attachments.find(att => att.type === 'photo');
                if (photoAttachment) {
                    // Берем URL картинки покрупнее (последний элемент в массиве sizes)
                    const sizes = photoAttachment.photo.sizes;
                    imageUrl = sizes[sizes.length - 1].url;
                }
            }

            // Создаем HTML-структуру карточки новости
            const card = document.createElement('div');
            card.className = 'news-card'; // Стилизуешь в css
            card.innerHTML = `
                ${imageUrl ? `<img src="${imageUrl}" alt="Новость" class="news-img">` : ''}
                <div class="news-content">
                    <span class="news-date">${postDate}</span>
                    <p class="news-text">${post.text.substring(0, 200)}...</p> 
                    <a href="https://vk.com{post.owner_id}_${post.id}" target="_blank" class="news-link">Читать в VK</a>
                </div>
            `;
            
            newsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        newsContainer.innerHTML = '<p>Не удалось загрузить новости. Пожалуйста, зайдите позже.</p>';
    }
}

// Запускаем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', loadNews);