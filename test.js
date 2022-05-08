suite('Tests pour la fonction fetchWhoami', function() {
    test('On vérifie sur un login utilisateur', function() {
        chai.assert.deepEqual(
        fetchWhoami(etatCourant),login);
    });
});

suite('Tests pour la fonction lanceWhoamiEtInsereLogin', function() {
    test('On vérifie un login utilisateur', function() {
        chai.assert.deepEqual(
        lanceWhoamiEtInsereLogin(etatCourant),login);
    });
});

suite('Tests pour la fonction TriOrdre', function() {
    test('On vérifie sur quelques types', function() {
        chai.assert.deepEqual(
        TriOrdre(etatCourant),
        [PokedexNumber,Name,Abilities,Type]
        );
    });
});

suite('Tests pour la fonction getPokemonList', function() {
    test('On vérifie sur quelques pokemons', function() {
        chai.assert.deepEqual(
        getPokemonList(etatCourant),
        [Blastoise,Pikachu,Charizard,Bulbasaur]
        );
    });
});

suite('Tests pour la fonction maxAffichagePokemon', function() {
    test('On vérifie sur quelques pokemons', function() {
        chai.assert.deepEqual(
        maxAffichagePokemon(etatCourant),
        [Blastoise,Pikachu,Charizard,Bulbasaur]
        );
    });
});

suite('Tests pour la fonction LimitationNbPokemon', function() {
    test('On vérifie avec une valeur', function() {
        chai.assert.deepEqual(
        LimitationnbPokemon(etatCourant),10);
    });
});

suite('Tests pour la fonction PokemonVoyant', function() {
    test('On vérifie sur quelques pokemons', function() {
        chai.assert.deepEqual(
        PokemonVoyant(etatCourant),
        [Blastoise,Pikachu,Charizard,Bulbasaur]
        );
    });
});