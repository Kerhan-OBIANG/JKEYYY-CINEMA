const cleAPI = "4397ccbf";

const zoneFilms = document.querySelector("#films");
const zoneHalloween = document.querySelector("#filmsHalloween");
const zoneFilms2024 = document.querySelector("#films2024");
const zoneCurieux = document.querySelector("#filmsCurieux");

const bouton2024 = document.querySelector("#chargerPlus");
const boutonIncontournables = document.querySelector("#chargerIncontournables");
const boutonHalloween = document.querySelector("#chargerHalloween");
const boutonCurieux = document.querySelector("#chargerCurieux");

const message2024 = document.querySelector("#messageFilms");
const messageIncontournables = document.querySelector("#messageIncontournables");
const messageHalloween = document.querySelector("#messageHalloween");
const messageCurieux = document.querySelector("#messageCurieux");

let page2024 = 0;


// Créer et afficher les cartes des films
function afficherFilms(listeFilms, zone) {
    listeFilms.forEach(function (film) {
        const carte = document.createElement("div");
        carte.classList.add("carte-film");

        const affiche = film.Poster !== "N/A"
            ? film.Poster
            : "https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible";

        carte.innerHTML = `
            <a href="movie.html?id=${film.imdbID}">
                <img
                    src="${affiche}"
                    alt="Affiche de ${film.Title}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible';"
                >
                <h3>${film.Title}</h3>
            </a>
            <p>${film.Year}</p>
        `;

        zone.appendChild(carte);
    });
}

// Rechercher un film par son titre
function chargerFilm(titre, zone, callback) {
    fetch(
        `https://www.omdbapi.com/?apikey=${cleAPI}&t=${encodeURIComponent(titre)}&type=movie`
    )
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (film) {
            if (film.Response === "True") {
                afficherFilms([film], zone);

                if (callback) {
                    callback(true);
                }
            } else if (callback) {
                callback(false);
            }
        })
        .catch(function (erreur) {
            console.log("Erreur :", erreur);

            if (callback) {
                callback(false);
            }
        });
}

// Afficher un message si la zone de message existe
function afficherMessage(zoneMessage, texte) {
    if (zoneMessage) {
        zoneMessage.textContent = texte;
    }
}

// Charger une sélection de films par groupes de 5
function configurerChargerPlus(listeFilms, zone, bouton, message) {
    let index = 0;

    if (!bouton) {
        console.log("Bouton introuvable pour cette sélection.");
        return;
    }

    bouton.addEventListener("click", function () {
        const nouveauxFilms = listeFilms.slice(index, index + 5);

        if (nouveauxFilms.length === 0) {
            afficherMessage(message, "Tous les films de cette sélection sont affichés.");
            bouton.hidden = true;
            return;
        }

        bouton.disabled = true;
        bouton.textContent = "Chargement...";
        afficherMessage(message, "Chargement des films...");

        let termines = 0;
        let trouves = 0;

        nouveauxFilms.forEach(function (titre) {
            chargerFilm(titre, zone, function (trouve) {
                if (trouve) {
                    trouves = trouves + 1;
                }

                termines = termines + 1;

                // Attendre la fin des recherches du groupe
                if (termines === nouveauxFilms.length) {
                    index = index + nouveauxFilms.length;

                    afficherMessage(
                        message,
                        trouves + " film(s) ajouté(s)."
                    );

                    bouton.disabled = false;
                    bouton.textContent = "Charger plus de films";

                    if (index >= listeFilms.length) {
                        bouton.hidden = true;
                        afficherMessage(
                            message,
                            "Sélection terminée : " + trouves +
                            " film(s) ajouté(s) lors de ce chargement."
                        );
                    }
                }
            });
        });
    });
}

// LES INCONTOURNABLES
const filmsPopulaires = [
    "Interstellar",
    "Inception",
    "The Dark Knight",
    "Avatar",
    "Jurassic Park"
];

const plusIncontournables = [
    "Forrest Gump",
    "The Shawshank Redemption",
    "Gladiator",
    "Titanic",
    "The Matrix",
    "Goodfellas",
    "Pulp Fiction",
    "The Godfather",
    "Saving Private Ryan",
    "Fight Club"
];

filmsPopulaires.forEach(function (titre) {
    chargerFilm(titre, zoneFilms);
});

configurerChargerPlus(
    plusIncontournables,
    zoneFilms,
    boutonIncontournables,
    messageIncontournables
);

// SPÉCIAL HALLOWEEN
const filmsHalloween = [
    "The Conjuring",
    "Scream",
    "Beetlejuice",
    "Halloween",
    "It",
    "The Shining"
];

const plusHalloween = [
    "A Nightmare on Elm Street",
    "Friday the 13th",
    "The Ring",
    "Insidious",
    "Sinister",
    "Get Out",
    "Us",
    "Hereditary",
    "The Babadook",
    "Final Destination"
];

filmsHalloween.forEach(function (titre) {
    chargerFilm(titre, zoneHalloween);
});

configurerChargerPlus(
    plusHalloween,
    zoneHalloween,
    boutonHalloween,
    messageHalloween
);

// POUR LES CURIEUX
const filmsCurieux = [
    "The Truman Show",
    "Whiplash",
    "The Grand Budapest Hotel",
    "Arrival",
    "The Prestige"
];

const plusCurieux = [
    "Moon",
    "Ex Machina",
    "Nightcrawler",
    "Prisoners",
    "Her",
    "The Lobster",
    "Coherence",
    "Memento",
    "Gone Girl",
    "Donnie Darko"
];

filmsCurieux.forEach(function (titre) {
    chargerFilm(titre, zoneCurieux);
});

configurerChargerPlus(
    plusCurieux,
    zoneCurieux,
    boutonCurieux,
    messageCurieux
);

// FILMS DE 2024
bouton2024.addEventListener("click", function () {
    page2024 = page2024 + 1;

    bouton2024.disabled = true;
    bouton2024.textContent = "Chargement...";
    afficherMessage(message2024, "Recherche des films de 2024...");

    fetch(
        `https://www.omdbapi.com/?apikey=${cleAPI}&s=action&y=2024&type=movie&page=${page2024}`
    )
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (donnees) {
            if (donnees.Response === "False") {
                page2024 = page2024 - 1;
                bouton2024.hidden = true;
                afficherMessage(message2024, "Il n'y a plus de résultats.");
                return;
            }

            afficherFilms(donnees.Search, zoneFilms2024);

            afficherMessage(
                message2024,
                donnees.Search.length + " films chargés."
            );

            const premiereNouvelleCarte =
                zoneFilms2024.children[
                    zoneFilms2024.children.length - donnees.Search.length
                ];

            if (premiereNouvelleCarte) {
                premiereNouvelleCarte.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        })
        .catch(function (erreur) {
            console.log("Erreur :", erreur);

            page2024 = page2024 - 1;
            afficherMessage(
                message2024,
                "Impossible de charger les films. Réessayez."
            );
        })
        .finally(function () {
            bouton2024.disabled = false;

            if (!bouton2024.hidden) {
                bouton2024.textContent = "Charger plus de films";
            }
        });
});
