

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
        this.nbr_pilote_total = 0
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
        while (cars.length) {
            cars.pop();
        }
        return;
    }

    draw_background (){
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


    raceStart(nbrPiloteVoulu = 10){
        this.destroyCars();
        this.createCars(nbrPiloteVoulu);//Optionnal ajouter true pour faire jouer humain
        this.nbr_pilote_total = nbrPiloteVoulu;//Allumage des descompte...
        this.nbr_pilote_vivant = nbrPiloteVoulu;//Allumage des descompte...
        this.start_time =   Date.now();
        this.start_frame =  frameCount;
    }

    waiForNextRound(){
        running = false;
        this.draw_wait_next_round();
    }

    draw_wait_next_round(){  
        fill('#6ab04c')
        textSize(60);
        text('Next Round', (this.width/2), (this.height/3)*2);
    }


}