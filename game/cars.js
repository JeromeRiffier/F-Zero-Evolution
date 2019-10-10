class car {
    constructor (human=false,driver){
        this.human=human;
        this.stillAlive = true;
        //Taille du vaisseaux
        this.r = 8,
        //Couleur du vaisseaux
        this.rgb = [random(0,175),random(0,175),random(0,175)]
        //Gestion de ça position au centre du point de départ de la Map
        this.pos = createVector(Map.internal[0][0]-Map.external[0][0],Map.internal[0][1]),
        //Pointé vers le haut
        this.dir = -PI/2,
        //Gestion Rotation
        this.rotation = 0,
        this.maxRotation = 0.2,
        //Gestion Vistesse
        this.vitesse = createVector(0, 0);
        this.maxSpeed = 0.8;
        this.friction = 0.97;
        //Creation du pilote
        if (!driver) {
            this.driver = new Driver();
        }else{
            this.driver = new Driver(false, driver.brain);
        }

        //Gestion score/ récompence
        this.nbrCheckpointTotal = Map.checkpointX1s.length //^^
        this.valeurProchainCheckpoint = 0;
    }


        update (){
            if (this.stillAlive==true) {
                if (this.human==true) {
                    this.commande_manuel();
                }else{
                    this.autopilot();
                }
                this.pos.add(this.vitesse);
                this.vitesse.mult(this.friction);
                //friction (1=aucune friction, 0=arret instantané)
                this.render();
                this.turn();
                this.collisionDetectionCheckpoint();
                this.collisionDetectionWall();

            }
        }

        render (){
            push();
            noStroke();
            fill(this.rgb[0],this.rgb[1],this.rgb[2]);
            translate(this.pos.x, this.pos.y);
            rotate(this.dir + PI/2);
            triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
            fill(255);
            triangle(-this.r/3, this.r/3, this.r/3, this.r/3, 0, -this.r/3);
            pop();
        }

        turn (){
            this.dir +=this.rotation;
        }

        setRotation (angle){
            if (-this.maxRotation < this.rotation && this.rotation < this.maxRotation) {
                this.rotation+=angle;                
            }
        }

        stopRotation  () {
            this.rotation = 0;
        }

        accelerated  (val=false) {
            if (val==false) {
                var force = p5.Vector.fromAngle(this.dir, this.maxSpeed);   
                this.vitesse.add(force);
            }else{
                let acceleration_value = map(val,0,1,0,this.maxSpeed);
                var force = p5.Vector.fromAngle(this.dir, acceleration_value);   
                this.vitesse.add(force);
            }
        }

        brake (val=false){
            if (val==false) {
                this.vitesse.mult(0.8);      
            }else{
                let brake_value = map(val,0,1, 1,0.8);
                this.vitesse.mult(brake_value);
            }
        }
        
        kill (){
            this.stillAlive = false;
            level.nbr_pilote_vivant -= 1;
            this.driver.tempsSurvecut = Date.now() - level.start_time;
            this.driver.score = (this.driver.tempsSurvecut/1000) + (this.driver.checkpointValide*10) + (this.driver.tourValide*50);
            //console.log("RIP " + this.driver.name );
            //console.log("Il aura quand même tenus un solide " + this.driver.tempsSurvecut/1000 + "sec  Et traverser " + this.driver.checkpointValide + " checkpoints le con^^");
        }

        commande_manuel (){
            if (this.human==true) {
                if (keyIsDown( RIGHT_ARROW)) {
                    this.setRotation(0.02);
                }else if (keyIsDown(LEFT_ARROW)) {
                    this.setRotation(-0.02);
                }
                if (keyIsDown(UP_ARROW)) {
                    this.accelerated();
                }
                if (keyIsDown(DOWN_ARROW)) {
                    this.brake();
                }
                if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
                    this.stopRotation();
                }
            }
        }

        autopilot(){
            //Verifier les distance aux obstacle
            this.driver.update(this.pos,this.dir);
            //Executé l'IA
            let actions = this.driver.think(this.pos, this.dir, this.vitesse);


            //console.log('Acceleration = ' + actions[0]);
            this.accelerated(actions[0]);

            //console.log('Freinage = ' + actions[1]);
            this.brake(actions[1])

            //console.log('Direction = ' + actions[2]);
            let turn_val;
            if(actions[2]>0.5){//Droite
                turn_val = map(actions[2],0.5,1,0,0.2)

            }else{//gauche
                turn_val = map(actions[2],0,0.5,0,-0.2)

            }
            this.setRotation(turn_val);


        }

        collisionDetectionCheckpoint (){
            if (this.valeurProchainCheckpoint==-1) {//Test de collision avec la ligne de départ
                if (collidePointLine(this.pos.x,this.pos.y,Map.external[0][0], Map.external[0][1], Map.internal[0][0], Map.internal[0][1], 0.5)) {
                    this.driver.tourValide += 1;
                    console.clear();
                    console.log("Nouveau tour pour " + this.driver.name + " ! " + "Score = " + this.driver.checkpointValide);
                    this.valeurProchainCheckpoint+=1;
                }
            }else{ //Test des collision avec les checkpoint
                if (collidePointLine(this.pos.x,this.pos.y,Map.checkpointX1s[this.valeurProchainCheckpoint],Map.checkpointY1s[this.valeurProchainCheckpoint],Map.checkpointX2s[this.valeurProchainCheckpoint],Map.checkpointY2s[this.valeurProchainCheckpoint], 0.5)) {
                    this.driver.checkpointValide += 1;
                    console.log(this.driver.name + this.driver.checkpointValide + " checkpoint validé !" );
                    if (this.valeurProchainCheckpoint == this.nbrCheckpointTotal-1) {
                        this.valeurProchainCheckpoint=-1;
                    }else{
                        this.valeurProchainCheckpoint+=1;
                    }
                }
            }
        }

        collisionDetectionWall (){
            for (let i = 1; i < Map.external.length; i++) {
                if (collidePointLine(this.pos.x,this.pos.y,Map.external[i-1][0], Map.external[i-1][1],Map.external[i][0], Map.external[i][1], 0.5)) {
                    this.kill();
                    //console.log("Il à touché le mur exterieur !");
                }
            }
            for (let i = 1; i < Map.internal.length; i++) {
                if (collidePointLine(this.pos.x,this.pos.y,Map.internal[i-1][0], Map.internal[i-1][1],Map.internal[i][0], Map.internal[i][1], 0.5)) {
                    //console.log("Il à touché le mur interieur !");
                    this.kill();
                }
            }
        }


}