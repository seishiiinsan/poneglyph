fetch("https://api.api-onepiece.com/v2/chapters/fr")
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("chapters");

    data.forEach(chapter => {

      const element = document.createElement("div");

      element.innerHTML = `
        <h3>Chapitre ${chapter.id}</h3>
        <p><strong>${chapter.title}</strong></p>
        <p>${chapter.description}</p>
        <p>Tome : ${chapter.tome.tome_number}</p>
        <p>${chapter.tome.title}</p>
        <hr>
      `;

      container.appendChild(element);

    });

  })
  .catch(error => {
    console.error("Erreur API :", error);
  });