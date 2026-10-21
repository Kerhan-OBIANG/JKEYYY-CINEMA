const cleAPI = "4397ccbf";

const champRecherche = document.querySelector("#recherche");
const zoneResultats = document.querySelector("#resultats");
const messageRecherche = document.querySelector("#messageRecherche");
const boutonPlus = document.querySelector("#chargerResultats");

let page = 1;
let rechercheActuelle = "";

function afficherResultats(listeFilms) {
    listeFilms.forEach(function (film) {
        const carte = document.createElement("div");
        carte.classList.add("carte-film");

        const affiche = film.Poster !== "N/A"
            ? film.Poster
            : "";

        carte.innerHTML = `
            <a href="movie.html?id=${film.imdbID}">
               <img
    src="${film.Poster && film.Poster !== "N/A"
                ? film.Poster
                : "https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible"}"
    alt="Affiche de ${film.Title}"
    loading="lazy"
    onerror="this.onerror=null; this.src='https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible';"
                <h3>${film.Title}</h3>
            </a>
            <p>${film.Year}</p>
        `;

        zoneResultats.appendChild(carte);
    });
}

function rechercherFilms(numeroPage, nouvelleRecherche) {
    const texte = champRecherche.value.trim();

    if (texte.length < 3) {
        zoneResultats.innerHTML = "";
        messageRecherche.textContent = "Tapez au moins 3 caractères.";
        boutonPlus.hidden = true;
        return;
    }

    if (nouvelleRecherche) {
        zoneResultats.innerHTML = "";
        page = 1;
        rechercheActuelle = texte;
    }

    messageRecherche.textContent = "Recherche en cours...";

    fetch(`https://www.omdbapi.com/?apikey=${cleAPI}&s=${encodeURIComponent(rechercheActuelle)}&type=movie&page=${numeroPage}`)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (donnees) {
            if (donnees.Response === "False") {
                if (numeroPage === 1) {
                    messageRecherche.textContent = "Aucun film trouvé.";
                    zoneResultats.innerHTML = "";
                } else {
                    messageRecherche.textContent = "Il n'y a plus de résultats.";
                }

                boutonPlus.hidden = true;
                return;
            }

            afficherResultats(donnees.Search);
            messageRecherche.textContent =
                `Résultats pour « ${rechercheActuelle} »`;

            boutonPlus.hidden = false;
        })
        .catch(function (erreur) {
            console.log("Erreur :", erreur);
            messageRecherche.textContent =
                "Impossible de charger les résultats.";
        });
}

champRecherche.addEventListener("input", function () {
    rechercherFilms(1, true);
});

// Charger la page suivante de résultats
boutonPlus.addEventListener("click", function () {
    page = page + 1;
    rechercherFilms(page, false);
});
