const container = document.getElementById('characters-container');

async function fetchCharacters() {
    try {
        const response = await fetch('https://api.api-onepiece.com/v2/characters/fr');
        const characters = await response.json();

        // On vide le message de chargement
        container.innerHTML = '';

        // On boucle sur chaque personnage reçu
        characters.forEach(char => {
            const charCard = document.createElement('div');
            charCard.className = 'character-card';

            charCard.innerHTML = `
                <h3>${char.name}</h3>
                <p><strong>Job :</strong> ${char.job || 'Inconnu'}</p>
                <p>${char.description || 'Pas de description disponible.'}</p>
                <hr>
            `;
            container.appendChild(charCard);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        container.innerHTML = "<p>Erreur lors du chargement des données.</p>";
    }
}

fetchCharacters();