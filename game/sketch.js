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




let running = false;
let cars = [];

let mouseRoad = []


//   Game engine
function setup() {
    frameRate(60);
    tf.setBackend('cpu');
    level = new level();
    Map = new Map();
    createCanvas(level.width, level.height);
    level.draw_background(true);
    //Ajout des joueurs
    level.createCars(1, true);//Optionnal ajouter true pour faire jouer humain
}

function draw() {
    //Pouvoire faire stop...
    if (!running) return
    level.update();



}



function mouseClicked(){
    if (mouseX > 0 && mouseX < level.width  && mouseY  > 0 && mouseY < level.height) {
        running = !running
    }
}
 



function start_race(){
    running=false;
    level.destroyCars();
    level.createCars(10);//Optionnal ajouter true pour faire jouer humain
    level.start_time =  frameCount;
    running=true;

}

