

class level {
    constructor (){
        this.height = 800,
        this.width = 1600,
        this.background_color_r = 51,
        this.background_color_g = 102, 
        this.background_color_b = 153,

        this.start_frame = 0,
        this.start_time = 0,

        this.nbr_pilote_vivant = 0,
        this.nbr_pilote_total = 0,
        this.gen = 0,
        this.new_child = [];
    }

    update() {
        this.draw_background();
        this.draw_gen_control();
        this.affichage_score();
        
        if(this.nbr_pilote_vivant > 0){//180 000 milliseconde == 3min
            Map.draw();
            for (let index = 0; index < cars.length; index++){
                cars[index].update()            
            }
        }else{
            console.log("Fin de la course");
            this.nextRound();
        }
    }

    createCars(nbr, human=false){
        for (let index = 0; index < nbr; index++) {
            cars.push(new car(human))
        }
    }

    destroyCars(){
        //On se debarasse des cerveaux (evitons les memory leak...)
        for (let index = 0; index < cars.length; index++) {
            cars[index].driver.dispose();            
        }
        //Puis on se debarasse des corps
        while (cars.length) {
            cars.pop();
        }
        //Et on rentre a la maison, faire un petit thé avec jeanette
        return;
    }

    destroyNew_child(){
        //On se debarasse des cerveaux (evitons les memory leak...)
        for (let index = 0; index < this.new_child.length; index++) {
            this.new_child[index].dispose();            
        }
        //Puis on se debarasse des corps
        while (this.new_child.length) {
            this.new_child.pop();
        }
        //Et on rentre a la maison, faire un petit thé avec jeanette
        return;
    }

    draw_background(){
        //Dessine le fond
        background ( this.background_color_r, this.background_color_g, this.background_color_b)
    }

    draw_gen_control(){
        rect(1320, 25, 220, 50, 20, 15, 10, 5);
        noStroke();
        fill(0, 225, 0)
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Generation suivante", 1425, 50);
    }

    draw_start(){
        stroke('#33ccff')
        strokeWeight(4)
        fill('#3366cc')
        rect((this.width/2)-120, ((this.height/3)*2)-60, 240, 110)
        noStroke()
        fill('#eb2f06')
        textAlign(CENTER, CENTER);
        textSize(60);
        text('F-Zero Evolution', (this.width/2), (this.height/3));
        textSize(30);
        text('par Jérôme Riffier', (this.width/2)+120, (this.height/2)-25);        
        fill('#6ab04c')
        textSize(60);
        text('START', (this.width/2), (this.height/3)*2);
    }

    affichage_score(){
        //Le conteur de parties
        //Le compteur de joueur encore en vie
        fill(200, 200, 200)
        textSize(20);
        textAlign(LEFT, CENTER);
            text("Generation : " + this.gen, (this.width-260), 130);
            text("Nombre de joueur : "+ this.nbr_pilote_vivant, this.width-260, 100);
        /*Affichage score max
            fill(220, 220, 220)
            textSize(20);
            textAlign(LEFT, CENTER);
            text("Score :"+ this.time, this.width-250, this.height-40);*/
    }

    start(nbrPiloteVoulu){
        this.destroyCars();
        this.createCars(nbrPiloteVoulu);//Optionnal ajouter true pour faire jouer humain
        this.nbr_pilote_total = nbrPiloteVoulu;//Allumage des descompte...
        this.nbr_pilote_vivant = nbrPiloteVoulu;//Allumage des descompte...
        this.start_time =   Date.now();
        this.start_frame =  frameCount;
    }

    select_best(){
        //on trie cars[] du moin bon cars[0] vers le meilleur cars[cars.length];
        cars.sort((a,b) => (a.driver.score > b.driver.score) ? 1 : -1 );

        //Mtn on efface tous ceux qui ont un score =< 0
        while (cars.length>0 && cars[0].driver.score<=0) {
            cars[0].driver.dispose();
            cars.shift();
        }
        //Mtn on créer autant d'enfant qu'il faudras a partir des joueur encore existant pour revenir au nombre de joueur voulut.
        this.new_child = [];

        while (this.new_child.length + cars.length < nbr_cars_wanted) {
            let child = new Driver(false,this.random_select_by_score(cars))
            let child_car = new car(false,child)
            this.new_child.push(this.reproduce_driver(child_car));
            child.dispose();
            child_car.driver.dispose();
        }
        for (let i = 0; i < this.new_child.length && cars.length < nbr_cars_wanted; i++) {
            cars.push(new car(false, this.new_child[i]));
        }
        this.destroyNew_child();
        return ;

    }
    //Fais marcher ça, c'est la clefs de tout
    random_select_by_score(array){
        let total_score = 0;
        array.forEach(car => {
            total_score += car.driver.score;
        });
        let rng = random(1, total_score);
        //Remplacer par un while
        for (let i = 0; i < array.length; i++) {
            rng -= array[i].driver.score;
            if(rng <= 0){
                return array[i].driver.brain;
            }
        };
        //Fin

    }

    reproduce_driver(car){
        let child = new Driver(false, car.driver.brain);
        child.mutate();
        return child;
    }

    resetCarStats(){
        for (let i = 0; i < cars.length; i++) {
            cars[i].pos = createVector(Map.internal[0][0]-Map.external[0][0],Map.internal[0][1]);
            cars[i].dir = -PI/2;
            cars[i].rotation = 0;
            cars[i].vitesse = createVector(0, 0);
            cars[i].driver.reset();
            cars[i].stillAlive = true;
        }
    }

    nextRound(){
        running = false;
        for (let index = 0; index < cars.length; index++){
            if(cars[index].stillAlive){
                cars[index].kill();            
            }
        }
        this.gen += 1;
        this.select_best();
        this.resetCarStats();
        this.start_time =   Date.now();
        this.start_frame =  frameCount;
        this.nbr_pilote_vivant = cars.length;
        running = true;
    }
}