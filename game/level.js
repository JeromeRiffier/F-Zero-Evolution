

class level {
    constructor (){
        this.height = 800,
        this.width = 1600,
        this.background_color_r = 51,
        this.background_color_g = 102, 
        this.background_color_b = 153,

        this.start_time = frameCount
    }
    reset (){
        this.height = 500,
        this.width = 1600
    }
    
    update() {
        this.draw_background();
        Map.draw();
        for (let index = 0; index < cars.length; index++){
            cars[index].update()            
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

    draw_background (start = false){
        //Dessine le fond
        background ( this.background_color_r, this.background_color_g, this.background_color_b)
       
        //On precise qu'il faut cliquer sur start + Info accueil
        if(start){
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
    }


}