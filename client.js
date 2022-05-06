/* ******************************************************************
 * Constantes de configuration
 * ****************************************************************** */
const apiKey = "46db2fd5-17fe-45e9-bf74-db2b8a37a726";
const serverUrl = "https://lifap5.univ-lyon1.fr";

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami() {
    return fetch(serverUrl + "/whoami",
        {headers: {"Api-Key": document.getElementById("PasswordAPI").value}})
        .then((response) => {
            if (response.status === 401) {
                return response.json().then((json) => {
                    console.log(json);
                    return { err: json.message };
                });
            } else {
                return response.json();
            }
        })
        .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans la modale
 * d'affichage de l'utilisateur puis déclenche l'affichage de cette modale.
 * @param {Etat} etatCourant l'état courant
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant) {
    return fetchWhoami().then((data) => {
        majEtatEtPage(etatCourant, {
            login: data.user, // qui vaut undefined en cas d'erreur
            errLogin: data.err, // qui vaut undefined si tout va bien
            loginModal: false, // on affiche la modale
        });
        console.log("User :",data.user)
    });
}


/**
 * Génère le code HTML du corps de la modale de login. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération,
 * mais ce n'est pas obligatoire ici.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereModaleLoginBody(etatCourant) {
    const text =
        etatCourant.errLogin !== undefined ?
        etatCourant.errLogin :
        etatCourant.login;
    return {
        html: `
          <section class="modal-card-body">
            <div class="field>
              <label class="label"> <b>Clé d'API</b> <label>
              <input id="PasswordAPI" type="password" class="input" value>
            </div>
          </section>
          `,
        callbacks: {},
    };
}

/**
 * Génère le code HTML du titre de la modale de login
 * et les callbacks associés.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginHeader(etatCourant) {
    return {
        html: `
<header class="modal-card-head  is-back">
  <p class="modal-card-title">Utilisateur</p>
  <button
    id="btn-close-login-modal1"
    class="delete"
    aria-label="close"
    >
  </button>
</header>`,
callbacks: {
            "btn-close-login-modal1": {
                onclick: () => majEtatEtPage(etatCourant, {loginModal: false}),
            },
        },
    };
}

/**
 * Génère le code HTML du base de page de la modale de login
 * et les callbacks associés.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginFooter(etatCourant) {
    return {
        html: `
  <footer class="modal-card-foot" style="justify-content: flex-end">
    <button id="btn-fermer" class="is-danger button">Fermer</button>
    <button id="btn-valider" class="is-success button">Valider</button>
  </footer>
  `,
        callbacks: {
            "btn-fermer": {
                onclick: () => majEtatEtPage(etatCourant, {loginModal: false}),
            },
            "btn-valider": {
              onclick: () => lanceWhoamiEtInsereLogin(etatCourant),
            },
        },
    };
}

/**
 * Génère le code HTML de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLogin(etatCourant) {
    const header = genereModaleLoginHeader(etatCourant);
    const footer = genereModaleLoginFooter(etatCourant);
    const body = genereModaleLoginBody(etatCourant);
    const activeClass = etatCourant.loginModal ? "is-active" : "is-inactive";
    return {
        html: `
      <div id="mdl-login" class="modal ${activeClass}">
        <div class="modal-background"></div>
        <div class="modal-card">
          ${header.html}
          ${body.html}
          ${footer.html}
        </div>
      </div>`,
      callbacks: {...header.callbacks, ...footer.callbacks, ...body.callbacks},
    };
}

/* ************************************************************************
 * Gestion de barre de navigation contenant en particulier les bouton Pokedex,
 * Combat et Connexion.
 * ****************************************************************** */

/**
 * Déclenche la mise à jour de la page en changeant l'état courant pour que la
 * modale de login soit affichée
 * @param {Etat} etatCourant
 */
function afficheModaleConnexion(etatCourant) {
    return majEtatEtPage(etatCourant,{loginModal: true});
}

/**
 * Génère le code HTML et les callbacks pour la partie droite de la barre de
 * navigation qui contient le bouton de login.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function genereBoutonConnexion(etatCourant) {
  const html =
  `${etatCourant.login != undefined ? `<a class="navbar-item"> ${etatCourant.login}</a>` : ''}
  <div class="buttons navbar-item">
    ${etatCourant.login == undefined ?
    `<a id="btn-connect" class="button is-light"> Connexion </a>` :
    `<a id="btn-disconnect" class="button is-danger"> Déconnexion </a>`}
  </div>`;
    return {
        html: html,
        callbacks: {
            "btn-connect": {
                onclick: () => afficheModaleConnexion(etatCourant),
            },
            "btn-disconnect": {
              onclick: () => majEtatEtPage(etatCourant,{login: undefined}),
            },
        },
    };
}

/**
 * Génère le code HTML de la barre de navigation et les callbacks associés.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function genereBarreNavigation(etatCourant) {
    const connexion = genereBoutonConnexion(etatCourant);
    return {
        html: `
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar">
            <div class="navbar-item"><div class="buttons">
                <a id="btn-pokedex" class="button is-light"> Pokedex </a>
                <a id="btn-combat" class="button is-light"> Combat </a>
            </div>
            </div>
            ${connexion.html}
          </div>
        </nav>`,
        callbacks: {
          ...connexion.callbacks,
          "btn-pokedex": {onclick: () => console.log("click bouton pokedex")},
          "btn-combat": {onclick: () => console.log("click bouton combat")},
        },
    };
}

/**
 * Génère le code HTML de la barre de recherche. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
 function genereBarreRecherche(etatCourant) {
  const html = `
    <input id="btn-search" class="input" type="text" placeholder="Rechercher un pokemon" value="${etatCourant.search || ''}" />
    <p id="look" </p>`
    const callbacks = {
      "btn-search": ()=>{
        const search = document.getElementById("btn-search").value
        majEtatEtPage(etatCourant,{search: search})
        /*oninput = PokemonVoyant(etatCourant) */
      }
    }
  return {
    html: html,
    callbacks: callbacks,
  }
 }

/**
 * Génère le code qui défini la liste de pokemon à afficher
 * selon l'ordre et le tri défini
 * @param {Etat} etatCourant
 * @returns une liste de pokemon
 */
 function PokemonVoyant(etatCourant) {
  const {ordre,type} = TriOrdre(etatCourant);//recuperation de l'ordre et du tri
  const listePokemon = maxAffichagePokemon(etatCourant);//recuperation des pokemons à afficher
  const pokemonTrie = listePokemon.sort((a,b) => {//recuperation liste pokemon trié
    if(type == "PokedexNumber") return ordre ? a.PokedexNumber - b.PokedexNumber : b.PokedexNumber - a.PokedexNumber;
    else if (type == "name")
      return ordre?a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
    else if (type == "abilities")
      return ordre?a.Abilities.join("\n").localeCompare(b.Abilities.join("\n"))
        : b.Abilities.join("\n").localeCompare(a.Abilities.join("\n"));
    else if (type == "type")
      return ordre?a.Types.join("\n").localeCompare(b.Types.join("\n"))
        : b.Types.join("\n").localeCompare(a.Types.join("\n"))
  }).filter(x => x.Name.toLowerCase()
    .includes(etatCourant.search ? etatCourant.search.toLowerCase() : ""))
  const nbrPokemon = LimitationNbPokemon(etatCourant)//recuperation du nombre de pokemons à afficher
  const pokemonAfficher = pokemonTrie.slice(0,nbrPokemon)//recuperation pokemons à afficher
  return pokemonAfficher;//on retourne la liste de pokemon limiter
}

/**
 * Génère le code qui défini le nombre de pokemon à afficher
 * selon l'ordre et le tri défini
 * @param {Etat} etatCourant
 * @returns une limite de pokemon à afficher
 */
function LimitationNbPokemon(etatCourant) {
  const maxPokemon = maxAffichagePokemon(etatCourant)
    .filter(x => x.Name.toLowerCase()
    .includes(etatCourant.search ? etatCourant.search.toLowerCase() : ""))
  const limitePokemon = etatCourant.limitePokemon ? etatCourant.limitePokemon : 10
  if(limitePokemon > maxPokemon) return maxPokemon;
  if(limitePokemon < maxPokemon && maxPokemon < 10) return maxPokemon;
  if(limitePokemon < 10 && maxPokemon > 10) return 10;
  return limitePokemon;
}

function maxAffichagePokemon(etatCourant) {
  return etatCourant.mesPokemons ? etatCourant.pokemons
   .filter(p=>etatCourant.pokemons.includes(p.PokedexNumber)):etatCourant.pokemons;
}

/**
 * Récupère l'ordre et le type du tri de la liste de pokemons
 * @param {Etat} etatCourant
 * @returns un objet contenant l'ordre et le type du tri
 */
function TriOrdre(etatCourant) {
  const triOrdre = etatCourant.triOrdre != undefined?etatCourant.triOrdre:true;
  const triType = etatCourant.triType ? etatCourant.triType : "PokedexNumber";
  return {
    ordre: triOrdre,
    type: triType,
  }
}

/**
 * Génère le code HTML l'entete de la liste de pokemon. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
 function genereTeteListePokemon(etatCourant) {
  const tri = TriOrdre(etatCourant);
  return {
    html:`<thead><tr><th> Image </th>
    <th id="tri-id"># ${tri.type == "PokedexNumber" ? tri.ordre? 'v' : '^' : ''} </th>
    <th id="tri-name">Name ${tri.type == "name" ? tri.ordre? 'v':'^':''}</th>
    <th id="tri-abilities">Abilities
    ${tri.type=="abilities"?tri.ordre?'v':'^':''}</th>
    <th id="tri-type">Type ${tri.type == "type" ? tri.ordre? 'v':'^':''} </th>
    </tr></thead>`,
    callbacks: {
      "tri-id": {onclick: ()=>majEtatEtPage(etatCourant,
        {triType: "PokedexNumber", triOrdre : tri.type != "PokedexNumber" ? true : !tri.ordre})},
      "tri-name": {onclick: ()=>majEtatEtPage(etatCourant,
        {triType: "name", triOrdre : tri.type != "name" ? true : !tri.ordre})},
      "tri-abilities": {onclick: ()=>majEtatEtPage(etatCourant,
        {triType:"abilities",triOrdre:tri.type!="abilities"?true:!tri.ordre})},
      "tri-type": {onclick: ()=>majEtatEtPage(etatCourant,
        {triType: "type", triOrdre : tri.type != "type" ? true : !tri.ordre})},
    }
  }}

/**
 * Génère le code HTML le corps de la liste de pokemon. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereCorpsListePokemon(pokemons,etatCourant) {
  const ligneTableau = pokemons.map((pokemon) => //on crée un tableau avec html pour chaque ligne du tableau
  `<tr id="pokemon-${pokemon.PokedexNumber}"
    class=" ${etatCourant.pokemon && etatCourant.pokemon.PokedexNumber ==
      pokemon.PokedexNumber ? "is-selected" : "" }">
    <td><img src="${pokemon.Images.Detail}" alt="${pokemon.Name}"/></td>
    <td>${pokemon.PokedexNumber}</td>
    <td>${pokemon.Name}</td>
    <td>${pokemon.Abilities.join("</br>")}</td>
    <td>${pokemon.Types.join("</br>")}</td>
  </tr>`).join("")
  const callbacks = pokemons.map((pokemon) => ({//on crée un tableau avec les callbacks pour chaque pokemon du tableau
    [`pokemon-${pokemon.PokedexNumber}`]: { onclick: () => {
        majEtatEtPage(etatCourant, { pokemon: pokemon });
      },
    },}))
  return {
    html: `<tbody>${ligneTableau}</tbody>`,
    callbacks: callbacks.reduce((acc, cur) => ({...acc, ...cur }), {}),//On fusionne les callbacks grâce au reduce
  }
}

/**
 * Génère le code HTML du pied de page de la liste de pokemon
 * et les callbacks pour le bouton permettant
 * d'afficher 10 pokemons de plus.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et
 * la description des callbacks à enregistrer dans le champ callbacks
 */
 function generePiedPageListePokemon(etatCourant) {
  const nbPoke = maxAffichagePokemon(etatCourant)
  const nbPokeAffiche = LimitationNbPokemon(etatCourant)
  const html = `<div class="buttons navbar-item">
      <a id="btn-plus" class="button is-success"> Plus </a>
      <a id="btn-moins" class="button is-danger"> Moins </a>
  </div>
  <div class="has text-centered"> <a>${nbPokeAffiche}</a>Pokemons </div>`
  return {
    html: html,
    callbacks: {
      "btn-plus": {onclick: () => majEtatEtPage(etatCourant, 
        {nbPokeAffiche: nbPokeAffiche + 10 < nbPoke 
          ? nbPokeAffiche + 10 > nbPoke : nbPokeAffiche}),},
      "btn-moins": {onclick: () => majEtatEtPage(etatCourant, 
        {nbPokeAffiche: nbPokeAffiche - 10 > nbPoke 
          ? nbPokeAffiche - 10 < nbPoke : nbPokeAffiche}),},
    },
  };
}

/**
 * Génère le code HTML de la liste de pokemon. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereListePokemon(etatCourant) {
  const pokemonVu = PokemonVoyant(etatCourant)
  const teteListe = genereTeteListePokemon(etatCourant)
  const corpsListe = genereCorpsListePokemon(pokemonVu,etatCourant)
  const piedPageListe = generePiedPageListePokemon(etatCourant)
  const html = `<table class="table is-fullwidth">
                  ${teteListe.html}
                  ${corpsListe.html}
                </table>
                <tfoot>
                  ${piedPageListe.html}
                </tfoot>`
  return {
        html: html,
        callbacks: {...teteListe.callbacks,
                    ...corpsListe.callbacks,
                    ...piedPageListe.callbacks
        }
  }
}

/**
 * Génère le code HTML du footer des infos des pokemons
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
 function footerInfoPokemon(etatCourant) {
  const html = `<button id="ajout-deck" class="is-success button" tabindex="0">
  Ajouter à mon deck</button>`
  return {
    html: html, 
    callbacks: {},
  }
}

/**
 * Génère le code HTML du body des infos des pokemons
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
 function bodyInfoPokemon(etatCourant) {
  if (!etatCourant.pokemon) return { html: "", callbacks: {} };
  const pokemon = etatCourant.pokemon
  const html = `
      <article class="media">
        <h1 class="title">${pokemon.Name}</h1>
      </article>
      <div class="card-content">
        <article class="media">
        <div class="media-content">
          <div class="content has-text-left">
            <p>Hit points: ${pokemon.Attack} </p>
              <h3>Abilities</h3>
                <ul>
                  <li> ${pokemon.Abilities.join("<li></li>")} </li>
                </ul>
              <h3>Resistant against</h3>
                <ul>
                  <li>${Object.keys(pokemon.Against)
                  .filter(x=>pokemon.Against[x] < 1).join("<li></li>")}</li>
                </ul>
              <h3>Weak against</h3>
                <ul>
                  <li>${Object.keys(pokemon.Against)
                  .filter(x=>pokemon.Against[x] > 1).join("<li></li>")}</li>
                </ul>
          </div>
        </div>
        <figure class="media-right">
          <figure class="image is-475x475">
            <img class="" src="${pokemon.Images.Full}""/>
          </figure>
        </figure>
  </article>`
  return {
    html: html,
    callbacks: {},
  }
}

/**
 * Génère le code HTML du header des infos des pokemons
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function headerInfoPokemon(etatCourant) {
  if (!etatCourant.pokemon) return { html: "", callbacks: {} };
  const pokemon = etatCourant.pokemon
  const html = ` <div class="card-header">
        <div class="card-header-title">
          ${pokemon.JapaneseName} (#${pokemon.PokedexNumber})
        </div>
      </div>`
  return {
    html: html,
    callbacks: {},
  }
}

/**
 * Génère le code HTML des infos sur le pokemon sélectionné.
 * On renvoie en plus un objet callbacks vide pour faire comme
 * les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereInfoPokemon(etatCourant) {
    const header = headerInfoPokemon(etatCourant)
    const body = bodyInfoPokemon(etatCourant)
    const footer = footerInfoPokemon(etatCourant)
    const html =
   `<div class="card">
      ${header.html}
    </div>
    <div class="card-content">
      ${body.html}
    </div>
    <div class="card-footer">
      ${footer.html}
    </div>`
    return {
        html: html,
        callbacks: {
          ...header.callbacks,...body.callbacks,...footer.callbacks,
        }
    }
}

/**
 * Génère le code HTML de la page de base, soit le pokedex. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function generePagePokedex(etatCourant) {
  const tabPokemon = genereListePokemon(etatCourant)
  const pokemonInfo = genereInfoPokemon(etatCourant)
  const barreRecherche = genereBarreRecherche(etatCourant)
  const html = `${barreRecherche.html}
  <div class="columns"><div class="column">
    <div class="tabs is-centered">
        <ul>
          <li id="mes-pokemon" 
            class="${etatCourant.mesPokemons ? "is-active": ""}">
            <a>Mes pokemons</a></li>
          <li id="tout-pokemon"
            class="${etatCourant.mesPokemons ? "": "is-active"}">
            <a> Tout les pokemons </a> </li>
        </ul>
      </div>
      <div id="tbl-pokemons">${tabPokemon.html}</div>
    </div>
    <div class="column"> ${pokemonInfo.html}</div>
  </div>`
  const callbacks = {
    "mes-pokemon": {
      onclick: () => {majEtatEtPage(etatCourant, {mesPokemons: true})}
    },
    "tout-pokemon": {
      onclick: () => {majEtatEtPage(etatCourant, {mesPokemons: false})}
    },
  }
  return {
      html: html,
      callbacks: {
        ...tabPokemon.callbacks,
        ...pokemonInfo.callbacks,
        ...barreRecherche.callbacks,
        ...callbacks,
      }
  };
}

function genereCorpsPage(etatCourant) {
    return generePagePokedex(etatCourant);
}

//fonction recupere liste poké sur serveur avec requete fetch sur API
async function getPokemonList() {
    return fetch(serverUrl + "/pokemon")
        .then(async(response) => { // async pour pouvoir utiliser await
            if (response.status == 200) {
              //await attend la reponse et data contient la liste des pokemons
              const data = await response.json()
              return data;
            } else {
                return []; //sinon on retourne un tab vide
            }
        })
        .catch([]);
}

/**
 * Génére le code HTML de la page ainsi que l'ensemble des callbacks à
 * enregistrer sur les éléments de cette page.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html
 * et la description des callbacks à enregistrer dans le champ callbacks
 */
function generePage(etatCourant) {
    const barredeNavigation = genereBarreNavigation(etatCourant);
    const modaleLogin = genereModaleLogin(etatCourant);
    const corpsPage = genereCorpsPage(etatCourant);
    // remarquer l'usage de la notation ...ci-dessous qui permet de "fusionner"
    // les dictionnaires de callbacks qui viennent de la barre et de la modale.
    // Attention, les callbacks définis dans modaleLogin.callbacks vont écraser
    // ceux définis sur les mêmes éléments dans barredeNavigation.callbacks. En
    // pratique ce cas ne doit pas se produire car barreDeNavigation et
    // modaleLogin portent sur des zone différentes de la page et n'ont pas
    // d'éléments en commun.
    return {
        html: barredeNavigation.html + modaleLogin.html + corpsPage.html,
        callbacks: {
          ...barredeNavigation.callbacks, ...modaleLogin.callbacks,
          ...corpsPage.callbacks,
        },
    };
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Créé un nouvel état basé sur les champs de l'ancien état, mais en prenant en
 * compte les nouvelles valeurs indiquées dans champsMisAJour, puis déclenche
 * la mise à jour de la page et des événements avec le nouvel état.
 *
 * @param {Etat} etatCourant etat avant la mise à jour
 * @param {*} champsMisAJour objet contenant les champs à mettre à jour, ainsi
 * que leur (nouvelle) valeur.
 */
function majEtatEtPage(etatCourant, champsMisAJour) {
    const nouvelEtat = {...etatCourant, ...champsMisAJour };
    majPage(nouvelEtat);
}


/**
 * Prend une structure décrivant les callbacks à enregistrer et effectue les
 * affectation sur les bon champs "on...". Par exemple si callbacks contient la
 * structure suivante où f1, f2 et f3 sont des callbacks:
 *
 * { "btn-pokedex": { "onclick": f1 },
 *   "input-search": { "onchange": f2,
 *                     "oninput": f3 }
 * }
 *
 * alors cette fonction rangera f1 dans le champ "onclick" de l'élément dont
 * l'id est "btn-pokedex", rangera f2 dans le champ "onchange" de l'élément
 * dont l'id est "input-search" et rangera f3 dans le champ "oninput" de ce
 * même élément. Cela aura, entre autres, pour effet de délclencher un appel
 * à f1 lorsque l'on cliquera sur le bouton "btn-pokedex".
 *
 * @param {Object} callbacks dictionnaire associant les id d'éléments à un
 * dictionnaire qui associe des champs "on..." aux callbacks désirés.
 */
function enregistreCallbacks(callbacks) {
    Object.keys(callbacks).forEach((id) => {
        const elt = document.getElementById(id);
        if (elt === undefined || elt === null) {
          console.log(
            `Élément inconnu: ${id},
             impossible d'enregistrer de callback sur cet id`
          );
        } else {
            Object.keys(callbacks[id]).forEach((onAction) => {
                elt[onAction] = callbacks[id][onAction];
            });
        }
    });
}

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
    console.log("CALL majPage");
    const page = generePage(etatCourant);
    document.getElementById("root").innerHTML = page.html;
    enregistreCallbacks(page.callbacks);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
async function initClientPokemons() {
    console.log("CALL initClientPokemons");
    const etatInitial = {
        loginModal: false,
        login: undefined,
        errLogin: undefined,
        pokemons: await getPokemonList(),
    };
    console.log("init", etatInitial)
    majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    console.log("Exécution du code après chargement de la page");
    initClientPokemons();
});
