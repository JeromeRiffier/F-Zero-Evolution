

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
        
        if(Date.now() - this.start_time < 180000 && this.nbr_pilote_vivant > 0){//180 000 milliseconde == 3min
            Map.draw();
            for (let index = 0; index < cars.length; index++){
                cars[index].update()            
            }
        }else{
            console.log("Fin de la course");
            this.waiForNextRound();
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
        //Mtn on efface les 2/3 moins bons
        for (let i = 0; i < (3%cars["length"])*2; i++) {
            cars[0].driver.dispose();
            cars.shift();
        }
        //Mtn on créer 2 enfant par pilotes
        this.new_child = [];
        for (let i = 0; i < cars.length; i++) {
            this.new_child.push(this.reproduce_driver(cars[i]));
            this.new_child.push(this.reproduce_driver(cars[i]));            
        }
        for (let i = 0; i < this.new_child.length && i < nbr_cars_wanted; i++) {
            cars.push(new car(false, this.new_child[i]));
        }
        this.destroyNew_child();

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
            cars[i].stillAlive = true;
        }
    }

    waiForNextRound(){
        running = false;
        for (let index = 0; index < cars.length; index++){
            if(cars[index].stillAlive){
                cars[index].kill();            
            }
        }
        this.gen += 1;
        this.select_best();
        //Reset all car stats (pos, dir, speed) to start state
        this.resetCarStats();
        this.start_time =   Date.now();
        this.start_frame =  frameCount;
        this.nbr_pilote_vivant = cars.length;
        running = true;

    }

}