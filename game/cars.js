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
                this.am_i_late();

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
                let brake_value = map(val,0,1, 1,0.9);
                this.vitesse.mult(brake_value);
            }
        }
        
        kill (){
            this.stillAlive = false;
            level.nbr_pilote_vivant -= 1;
            this.driver.tempsSurvecut = Date.now() - level.start_time;
            this.calculate_score();
            //console.log("RIP " + this.driver.name );
            //console.log("Il aura quand même tenus un solide " + this.driver.tempsSurvecut/1000 + "sec  Et traverser " + this.driver.checkpointValide + " checkpoints le con^^");
        }
        calculate_score(){
            //console.log(this.driver.name + "est mort");
            this.driver.score = (this.driver.checkpointValide*this.driver.checkpointValide*2) + (this.driver.tourValide*this.driver.tourValide*10);
            // + (1/Temps entre les checkpoint)*20
            if (this.driver.temps_passage_checkpoint.length>1) {  
                console.log(this.driver.name + "a passé plusieur checkpoint");
                for (let i = 1; i < this.driver.temps_passage_checkpoint.length; i++) {
                    this.driver.score += (1/ (this.driver.temps_passage_checkpoint[i]-this.driver.temps_passage_checkpoint[i-1]))*20
                    console.log(this.driver.name + " a obtenu " + (1/ (this.driver.temps_passage_checkpoint[i]-this.driver.temps_passage_checkpoint[i-1]))*30 + " point en passant les checkpoints")
                }
            }
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


            
            //console.log('Direction = ' + actions[2]);
            let turn_val;
            if(actions[0]>=0.5){//Droite
                turn_val = map(actions[2],0.6,1,0,0.2);
                this.setRotation(turn_val);
                
            }else if(actions[0]<0.5){//gauche
                turn_val = map(actions[2],0,0.4,0,-0.2);
                this.setRotation(turn_val);
                
            }

            //console.log('Acceleration = ' + actions[0]);
            this.accelerated(actions[1]);

            //console.log('Freinage = ' + actions[1]);
            if (actions[2]<0.5) {
                this.brake(actions[1])
            }
            
        }

        collisionDetectionCheckpoint (){
            if (this.valeurProchainCheckpoint==0) {//Test de collision avec la ligne de départ
                //On test la collision avec le checkpoint precedent (mauvais sens, mort du joueur)
                if (collidePointLine(this.pos.x,this.pos.y,Map.checkpointX1s[Map.checkpointX1s.length-1],Map.checkpointY1s[Map.checkpointX1s.length-1],Map.checkpointX2s[Map.checkpointX1s.length-1],Map.checkpointY2s[Map.checkpointX1s.length-1], 0.5)) {
                   this.driver.checkpointValide -= 1;
                   this.kill();
                   return;
               }
            }            
            if (this.valeurProchainCheckpoint==-1) {//Test de collision avec la ligne de départ
                if (collidePointLine(this.pos.x,this.pos.y,Map.external[0][0], Map.external[0][1], Map.internal[0][0], Map.internal[0][1], 0.5)) {
                    this.driver.tourValide += 1;
                    this.driver.temps_passage_tours.push((Date.now() - level.start_time)/1000)
                    this.driver.temps_inter_checkpoint=Date.now()/1000;
                    this.valeurProchainCheckpoint+=1;
                    return;
                }
            }else{ //Test des collision avec les checkpoint
                //On test la collision avec le checkpoint precedent (mauvais sens, mort du joueur)
                if (collidePointLine(this.pos.x,this.pos.y,Map.checkpointX1s[this.valeurProchainCheckpoint-2],Map.checkpointY1s[this.valeurProchainCheckpoint-2],Map.checkpointX2s[this.valeurProchainCheckpoint-2],Map.checkpointY2s[this.valeurProchainCheckpoint-2], 0.5)) {
                    this.driver.checkpointValide -= 1;
                    this.kill();
                    return;
                }
                if (collidePointLine(this.pos.x,this.pos.y,Map.checkpointX1s[this.valeurProchainCheckpoint],Map.checkpointY1s[this.valeurProchainCheckpoint],Map.checkpointX2s[this.valeurProchainCheckpoint],Map.checkpointY2s[this.valeurProchainCheckpoint], 0.5)) {
                    this.driver.checkpointValide += 1;
                    this.driver.temps_passage_checkpoint.push((Date.now() - level.start_time)/1000)
                    this.driver.temps_inter_checkpoint=Date.now()/1000;
                    //console.log(this.driver.name + this.driver.checkpointValide + " checkpoint validé !" );
                    if (this.valeurProchainCheckpoint == this.nbrCheckpointTotal-1) {
                        this.valeurProchainCheckpoint=-1;
                        return;
                    }else{
                        this.valeurProchainCheckpoint+=1;
                        return;
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

        am_i_late(){
            if (this.driver.temps_inter_checkpoint == 0) {
                this.driver.temps_inter_checkpoint = level.start_time/1000;
            }
            if (Date.now()/1000 - this.driver.temps_inter_checkpoint > max_time_between_checkpoint){
                //console.log("To late, you die Mr " + this.driver.name);
                this.kill();
            }
        }

}