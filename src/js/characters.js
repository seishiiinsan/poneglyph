const charactersContainer = document.getElementById('characters-container');
const paginationContainer = document.getElementById('pagination-container');

let allCharacters = [];
let currentPage = 1;
const charactersPerPage = 12;

async function fetchCharacters() {
    try {
        const response = await fetch('https://api.api-onepiece.com/v2/characters/fr');
        allCharacters = await response.json();
        displayPage(currentPage);
        setupPagination();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        charactersContainer.innerHTML = "<p>Erreur lors du chargement des données.</p>";
    }
}

function displayPage(page) {
    charactersContainer.innerHTML = '';
    currentPage = page;
    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const paginatedCharacters = allCharacters.slice(startIndex, endIndex);

    paginatedCharacters.forEach(char => {
        const charCard = document.createElement('div');
        charCard.className = 'character-card';

        let crewHtml = '';
        if (char.crew) {
            crewHtml = `<p><strong>Équipage :</strong> ${char.crew.name}</p>`;
        }

        charCard.innerHTML = `
            <div class="card-header">
                <h3>${char.name}</h3>
                <span class="character-job">${char.job || 'Inconnu'}</span>
            </div>
            <div class="card-section">
                <p><strong>Prime :</strong> ${char.bounty ? new Intl.NumberFormat().format(char.bounty.replace(/\./g, '')) + ' Berrys' : 'Inconnue'}</p>
                <p><strong>Statut :</strong> ${char.status || 'Inconnu'}</p>
                <p><strong>Âge :</strong> ${char.age || 'Inconnu'}</p>
                ${crewHtml}
            </div>
        `;
        charactersContainer.appendChild(charCard);
    });
    setupPagination();
    window.scrollTo(0, 0);
}

function setupPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(allCharacters.length / charactersPerPage);
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

fetchCharacters();