const cleAPI = "4397ccbf";
const zoneDetails = document.querySelector("#detailsFilm");
const parametres = new URLSearchParams(window.location.search);
const identifiant = parametres.get("id");

if (identifiant === null) {
    zoneDetails.textContent = "Aucun film n'a été sélectionné.";
} else {
    fetch(`https://www.omdbapi.com/?apikey=${cleAPI}&i=${identifiant}&plot=full`)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (film) {
            if (film.Response === "False") {
                zoneDetails.textContent = "Film introuvable.";
                return;
            }

            document.title = `${film.Title} | JKEYYY CINEMA`;

            const affiche = film.Poster && film.Poster !== "N/A"
                ? film.Poster
                : "https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible";

            let dateDVD = "Non renseignée";

            if (film.DVD && film.DVD !== "N/A") {
                const date = new Date(film.DVD);

                if (!isNaN(date.getTime())) {
                    dateDVD = date.toLocaleDateString("fr-FR");
                }
            }

            zoneDetails.innerHTML = `
                <div class="affiche-detail">
                    <img
    src="${affiche}"
    alt="Affiche de ${film.Title}"
    onerror="this.onerror=null; this.src='https://placehold.co/300x450/182235/F1F5F9?text=Affiche+indisponible';">
                </div>

                <div class="informations-film">
                    <h1>${film.Title}</h1>

                    <p class="metadonnees">
                        ${film.Year} · ${film.Runtime} · ${film.Genre}
                    </p>

                    <h2>Synopsis</h2>
                    <p>${film.Plot}</p>

                    <h2>Acteurs</h2>
                    <p>${film.Actors}</p>

                    <h2>Réalisateur</h2>
                    <p>${film.Director}</p>

                    <h2>Notes IMDb</h2>
                    <p>${film.imdbRating !== "N/A"
                    ? film.imdbRating + " / 10"
                    : "Non renseignée"}</p>

                    <h2>Sortie DVD</h2>
                    <p>${dateDVD}</p>
                </div>
            `;
        })
        .catch(function (erreur) {
            console.log("Erreur :", erreur);
            zoneDetails.textContent =
                "Impossible de charger les informations du film.";
        });
}
