// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Create card element
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.type = type;

    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    if (type === 'telegram') {
        const telegramIcon = document.createElement('i');
        telegramIcon.className = 'fab fa-telegram';
        telegramIcon.style.color = '#0088cc';
        telegramIcon.style.fontSize = '20px';
        titleContainer.appendChild(telegramIcon);
    } else {
        const favicon = document.createElement('img');
        const domain = new URL(item.url).hostname;
        favicon.src = `http://www.google.com/s2/favicons?domain=${domain}`;
        favicon.className = 'favicon';
        titleContainer.appendChild(favicon);
    }

    const title = document.createElement('h3');
    title.textContent = item.name;
    titleContainer.appendChild(title);

    const description = document.createElement('p');
    description.textContent = item.description;

    const link = document.createElement('a');
    link.href = type === 'telegram' ? `https://t.me/${item.username.substring(1)}` : item.url;
    link.textContent = type === 'telegram' ? item.username : 'مشاهده سایت';
    link.target = '_blank';

    card.appendChild(titleContainer);
    card.appendChild(description);
    card.appendChild(link);

    return card;
}

// Filter cards based on type
function filterCards(type) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search functionality
function searchCards(query) {
    const cards = document.querySelectorAll('.card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const link = card.querySelector('a').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm) || link.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize the application
async function initApp() {
    const data = await loadData();
    if (!data) return;

    const grid = document.getElementById('websiteGrid');

    // Add free websites
    data.websites.free.forEach(website => {
        grid.appendChild(createCard(website, 'free'));
    });

    // Add premium websites
    data.websites.premium.forEach(website => {
        grid.appendChild(createCard(website, 'premium'));
    });

    // Add telegram bots
    data.telegram_bots.forEach(bot => {
        grid.appendChild(createCard(bot, 'telegram'));
    });

    // Add applications
    data.applications.forEach(app => {
        grid.appendChild(createCard(app, 'apps'));
    });

    // Add event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterCards(button.dataset.filter);
        });
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchCards(e.target.value);
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);