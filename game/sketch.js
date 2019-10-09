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

