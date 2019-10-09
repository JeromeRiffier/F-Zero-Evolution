//Functions for evolution used in flappy IA
//A modifier pour selectionner le meilleur 1/3 des joueurs
//Les faire se reproduire (2gosse par joueur sauvé)
//Et clonner LE MEILLEUR a l'identique
//Puis relancer une nouvelle course avec les nouveau joueurs etc


function nextGeneration() {
    actualBestPlayer = get_last_best();
    actualise_stat (counter, level.time, calculateAverageScore());
    calculateFitness();
    for (let i = 0; i < total_cobaye-1; i++) {
        //players[i] = pickOne();
      players[i] = childBest();    
    }
    players.push(actualBestPlayer)
    for (let i = 0; i < total_cobaye; i++) {
      saved_players[i].dispose();
    }
    saved_players = [];
}

function childBest() {
    //trouver le meilleur, le cloner ET muter ses clone 
    var res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
    var player_temp = saved_players.find(function(player){ return player.score == res; })
    let child = new player(true, player_temp.brain);
    child.mutate();
    return child;
}

function get_last_best() {
    //trouver le meilleur et le cloner SANS le muter
    var res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
    var player_temp = saved_players.find(function(player){ return player.score == res; })
    let child = new player(true, player_temp.brain);
    child.wasBest = true
    
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let player of saved_players) {
        sum += player.score;
    }
    for (let player of saved_players) {
        player.fitness = player.score / sum;
    }
}