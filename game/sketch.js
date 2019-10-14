/*  Reste a faire 

    - Creer le systeme de recompence via le score des pilotes
        Plus il tienne lomgtemps
        Plus il vont vite d'un checkpoint a un autre
        Meilleur sera le score

    - Ajouter un timer de limite de fin
        5min a partir du moment ou le premier a finis sont premier tour ?
        ou
        15min a partir du début de la course ?

    - Préparer le systeme de reproduction mutation 
        Comment sélectionner les meilleurs ? combien on en garde ? 


    - Préparer le systeme de compétition pour permettre de refaire des course avec les joueurs des generation succesive

    - Ajouter une interface permettant de choisir le nombre de pilote/gen et autre parametre fort utile


*/
/*   Amélioration faisable 


    - Modifier la gestion de l'acceleration par l'IA
        Plutot que convertir l'output entre 0 et 1 de façon lineaire vers un range entre 0 et 0.2
        Peut être utilisé une courbe serais plus efficasse ?

    - Amelioré le calcul des  distance aux obstacle:
        Pour l'instant on test si les "vison_ray" touches chacque mur.
        Il dois y avoir moyen d'en prendre moin en compte.. (si ça à touché un bord exterieur ne pas calculé les bord interieur deja^^)
        De plus modifier la valeur fourni a l'ia, en fournissant la distance aux point d'impact des "vision_ray" plutot que leur position ?


*/

p5.disableFriendlyErrors = true;

let running = false;
let cars = [];
let mutation_rate = 0.1
const nbr_neurone_hidden = 15;
let nbr_cars_wanted = 150;
let max_time_between_checkpoint = 30; //Temps en sec pour pouvoir atteindre le checkpoint, passé ce delay le joueur meurs
let mouseRoad = []


//   Game engine
function setup() {
    frameRate(60);
    tf.setBackend('cpu');
    level = new level();
    Map = new Map();
    createCanvas(level.width, level.height);
    level.draw_background();
    level.draw_start();
    //Ajout des joueurs
    //level.createCars(1, true);//Optionnal ajouter true pour faire jouer humain
    start();

}

function draw() {
    //Pouvoire faire stop...
    if (!running) return
    level.update();

}



function mouseClicked(){
    if (mouseX > 1320 && mouseX < 1540  && mouseY  > 25 && mouseY < 75) {
        //Go next round ! 
        level.nextRound();
        return;
    }
    if (mouseX > 0 && mouseX < level.width  && mouseY  > 0 && mouseY < level.height) {
        running = !running;
        return;
    }
}
 
function start(){
    level.start(nbr_cars_wanted);
}

