const chaptersContainer = document.getElementById('chapters-container');
const paginationContainer = document.getElementById('pagination-container');

let allChapters = [];
let currentPage = 1;
const chaptersPerPage = 12;

async function fetchChapters() {
    try {
        const response = await fetch('https://api.api-onepiece.com/v2/chapters/fr');
        allChapters = await response.json();
        // Trier les chapitres par ID décroissant (les plus récents en premier)
        allChapters.sort((a, b) => b.id - a.id);
        displayPage(currentPage);
        setupPagination();
    } catch (error) {
        console.error("Erreur lors de la récupération des chapitres :", error);
        chaptersContainer.innerHTML = "<p>Erreur lors du chargement des chapitres.</p>";
    }
}

function displayPage(page) {
    chaptersContainer.innerHTML = '';
    currentPage = page;
    const startIndex = (page - 1) * chaptersPerPage;
    const endIndex = startIndex + chaptersPerPage;
    const paginatedChapters = allChapters.slice(startIndex, endIndex);

    paginatedChapters.forEach(chapter => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'character-card'; // Réutilisation du style des cartes

        chapterCard.innerHTML = `
            <div class="card-header">
                <h3>Chapitre ${chapter.id}</h3>
                <span class="character-job">${chapter.title}</span>
            </div>
            <div class="card-section">
                <p><strong>Tome :</strong> ${chapter.tome ? chapter.tome.tome_number : 'Inconnu'}</p>
                <p><strong>Arc :</strong> ${chapter.arc ? chapter.arc.title : 'Inconnu'}</p>
                <p class="chapter-desc">${chapter.description || 'Pas de description disponible.'}</p>
                <p style="text-align: right; font-size: 0.9rem; color: #6d4c41;">Publié le : ${chapter.release_date || 'Date inconnue'}</p>
            </div>
        `;
        chaptersContainer.appendChild(chapterCard);
    });
    setupPagination();
    window.scrollTo(0, 0);
}

function setupPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(allChapters.length / chaptersPerPage);
    const maxVisibleButtons = 5;

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Précédent';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => displayPage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Page Numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.innerText = '1';
        firstPageButton.addEventListener('click', () => displayPage(1));
        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => displayPage(i));
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.innerText = pageCount;
        lastPageButton.addEventListener('click', () => displayPage(pageCount));
        paginationContainer.appendChild(lastPageButton);
    }

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Suivant';
    nextButton.disabled = currentPage === pageCount;
    nextButton.addEventListener('click', () => displayPage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

fetchChapters();