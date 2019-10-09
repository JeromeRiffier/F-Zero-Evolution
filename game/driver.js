const proposition_name = ['Michel Boujenah','Michel Denisot','Michel Houellebecq','Michel Onfray','Michel Platini','Michel Polnareff','Michel Sardou','Michel Galabru','Michel Cymes','Michel Drucker','Michel Leeb','M. KOHLER','Mme de BAYSER','M. NUSSBAUMER','M. ZAJDENWEBER','Zerator','MisterMV','Squeezie','Aiekillu','Maghla','Nyo','Antoine Daniel','Joueur du Grenier','Seb du Grenier','Gotaga','Mickalow','Bob Lennon','TheFantasio974','Master Snakou','Sardoche','Aldériate','Wakz','Chap','LeRoiBisou','Narkuss','Trinity','Jeel','Moman','Gius','Mathieu Sommet','Aypierre','TheGuill84','Libe_','Lege','Aayley','DrFeelGood','ZulZorander','DamDamLive','Mynthos','Anthox Collaboy','Aelthan Ferragun','Carl Jr','Bren','Elarcis','Prinovex','Tenebie','Laink','Terracid','Gydias','Crawling Flesh','Unsterblicher','Kigyar','Mahyar','Bruce Benamran','Batbaileys','Benzaie','Ganesh2','Emmanuel Macron','Jeannot Nymousse','Gueuletons','Mr. Poulpe','Stardust','100Pseudo','Ermite Moderne','Tai Shindehai','Ishigata','MJ','Neku','StateAlchemist','JeFaisChierLesGens','JeanBaptisteShow','KickSama','Corobizar','LeDawg','LinksTheSun','Monsieur Plouf','SadPanda','Charlie Danger','Nota Bene','Ninja','Dr.Disrespect','Shroud','Cyprien','Norman','Deadslug','MaxiTruite','Aurelien_Sama','Bill Silverlight','Ika','EpeeForte','KennyStream','LittleBigWhale','Gom4rt','Alphacast','Lutti','Locklear','Diabalzane','Domingo','Kotei','Kameto','Baghera Jones','Doigby','Xari','Jiraya','Tweekz','Wingobear','Zankioh','Tio','Manuel Ferrara','Lapi','Best Marmotte','Etoiles','Hexakill','Zack Nani']


class driver{
    constructor(human=false, brain){
        //Option de debug
        this.debug = false;

        //Gestion score
        this.name = random(proposition_name);
        this.checkpointValide = 0; //+1 a chacque checkpoint
        this.tempsSurvecut = 0;//En milliseconde - permettra de calculer le score + gestion des stats


        //Gestion des ligne de vision/collision [x,y, distance] x et y = la position de la fin de la ligne et distance = distance d'impact avec le premier mur
        this.visionLeftHard = [],
        this.visionLeftSoft = [],
        this.visionAhead = [],
        this.visionRightSoft = [],
        this.visionRightHard = [],

        this.visionLeftHard_hit = [],
        this.visionLeftSoft_hit = [],
        this.visionAhead_hit = [],
        this.visionRightSoft_hit = [],
        this.visionRightHard_hit = [],

        this.visionLeftHard_where = [],
        this.visionLeftSoft_where = [],
        this.visionAhead_where = [],
        this.visionRightSoft_where = [],
        this.visionRightHard_where = []



        //Option IA
        if (brain && human == false) {
            this.brain = brain.copy();
        } else if (!brain && human == false){
            this.brain = new NeuralNetwork(8, nbr_neurone_hidden, 3);
        }
    }
    
    update(position, direction){
        this.vision_ray(position, direction);
        if (this.debug) {
            this.display_vision(position);//A retirer apres debug
        }
        this.calcul_obstacle_distance(position, this.debug);
    }

    vision_ray(position, direction){
        //Drois devant
        let vector_direction = p5.Vector.fromAngle(direction,500);
        let endLine = p5.Vector.add(position,vector_direction);
        this.visionAhead = [endLine.x,endLine.y];
        //Un peux a droite
        vector_direction = p5.Vector.fromAngle(direction-0.5,300);
        endLine = p5.Vector.add(position,vector_direction);
        this.visionRightSoft = [endLine.x,endLine.y];

        //Un peux plus a droite
        vector_direction = p5.Vector.fromAngle(direction-1.2,200);
        endLine = p5.Vector.add(position,vector_direction);
        this.visionRightHard = [endLine.x,endLine.y];

        //Un peux a gauche
         vector_direction = p5.Vector.fromAngle(direction+0.5,300);
         endLine = p5.Vector.add(position,vector_direction);
        this.visionLeftSoft = [endLine.x,endLine.y];

        //Un peux  plus a gauche
        vector_direction = p5.Vector.fromAngle(direction+1.2,200);
        endLine = p5.Vector.add(position,vector_direction);
        this.visionLeftHard = [endLine.x,endLine.y];

    }

    display_vision(position){
        line(position.x,position.y,this.visionLeftHard[0],this.visionLeftHard[1]);
        line(position.x,position.y,this.visionLeftSoft[0],this.visionLeftSoft[1]);
        line(position.x,position.y,this.visionAhead[0],this.visionAhead[1]);
        line(position.x,position.y,this.visionRightSoft[0],this.visionRightSoft[1]);
        line(position.x,position.y,this.visionRightHard[0],this.visionRightHard[1]);
    }

    calcul_obstacle_distance(position , display_circle=false){
        this.visionLeftHard_where = [0,0];
        this.visionLeftSoft_where = [0,0];
        this.visionAhead_where = [0,0];
        this.visionRightSoft_where = [0,0];
        this.visionRightHard_where = [0,0];
        //Point impact devant
        for (let i = 1; i < Map.external.length; i++) {
            this.visionAhead_hit = collideLineLine(position.x,position.y,this.visionAhead[0],this.visionAhead[1],Map.external[i-1][0],Map.external[i-1][1],Map.external[i][0],Map.external[i][1],true )
            if (this.visionAhead_hit.x != false) {
                this.visionAhead_where= [this.visionAhead_hit.x,this.visionAhead_hit.y];
                if(display_circle==true){
                    circle(this.visionAhead_hit.x,this.visionAhead_hit.y,20)// Optional
                }
            }
        }
        for (let i = 1; i < Map.internal.length; i++) {
            this.visionAhead_hit = collideLineLine(position.x,position.y,this.visionAhead[0],this.visionAhead[1],Map.internal[i-1][0],Map.internal[i-1][1],Map.internal[i][0],Map.internal[i][1],true )
            if (this.visionAhead_hit.x != false) {
                this.visionAhead_where= [this.visionAhead_hit.x,this.visionAhead_hit.y];
                if(display_circle==true){
                    circle(this.visionAhead_hit.x,this.visionAhead_hit.y,20)// Optional
                }
            }
        }

        
        //Point impact full gauche
        for (let i = 1; i < Map.external.length; i++) {
            this.visionLeftHard_hit = collideLineLine(position.x,position.y,this.visionLeftHard[0],this.visionLeftHard[1],Map.external[i-1][0],Map.external[i-1][1],Map.external[i][0],Map.external[i][1],true )
            if (this.visionLeftHard_hit.x != false) {
                this.visionLeftHard_where = [this.visionLeftHard_hit.x,this.visionLeftHard_hit.y];
                if(display_circle==true){
                    circle(this.visionLeftHard_hit.x,this.visionLeftHard_hit.y,20)// Optional
                }
            }
        }
        for (let i = 1; i < Map.internal.length; i++) {
            this.visionLeftHard_hit = collideLineLine(position.x,position.y,this.visionLeftHard[0],this.visionLeftHard[1],Map.internal[i-1][0],Map.internal[i-1][1],Map.internal[i][0],Map.internal[i][1],true )
            if (this.visionLeftHard_hit.x != false) {
                this.visionLeftHard_where = [this.visionLeftHard_hit.x,this.visionLeftHard_hit.y];
                if(display_circle==true){
                    circle(this.visionLeftHard_hit.x,this.visionLeftHard_hit.y,20)// Optional
                }
            }
        }

        //Point impact legere gauche
        for (let i = 1; i < Map.external.length; i++) {
            this.visionLeftSoft_hit = collideLineLine(position.x,position.y,this.visionLeftSoft[0],this.visionLeftSoft[1],Map.external[i-1][0],Map.external[i-1][1],Map.external[i][0],Map.external[i][1],true )
            if (this.visionLeftSoft_hit.x != false) {
                this.visionLeftSoft_where = [this.visionLeftSoft_hit.x,this.visionLeftSoft_hit.y];
                if(display_circle==true){
                    circle(this.visionLeftSoft_hit.x,this.visionLeftSoft_hit.y,20)// Optional
                }
            }
        }
        for (let i = 1; i < Map.internal.length; i++) {
            this.visionLeftSoft_hit = collideLineLine(position.x,position.y,this.visionLeftSoft[0],this.visionLeftSoft[1],Map.internal[i-1][0],Map.internal[i-1][1],Map.internal[i][0],Map.internal[i][1],true )
            if (this.visionLeftSoft_hit.x != false) {
                this.visionLeftSoft_where = [this.visionLeftSoft_hit.x,this.visionLeftSoft_hit.y];
                if(display_circle==true){
                    circle(this.visionLeftSoft_hit.x,this.visionLeftSoft_hit.y,20)// Optional
                }
            }
        }

        //Point impact legere droite
        for (let i = 1; i < Map.external.length; i++) {
            this.visionRightSoft_hit = collideLineLine(position.x,position.y,this.visionRightSoft[0],this.visionRightSoft[1],Map.external[i-1][0],Map.external[i-1][1],Map.external[i][0],Map.external[i][1],true )
            if (this.visionRightSoft_hit.x != false) {
                this.visionRightSoft_where = [this.visionRightSoft_hit.x,this.visionRightSoft_hit.y];
                if(display_circle==true){
                    circle(this.visionRightSoft_hit.x,this.visionRightSoft_hit.y,20)// Optional
                }
            }
        }
        for (let i = 1; i < Map.internal.length; i++) {
            this.visionRightSoft_hit = collideLineLine(position.x,position.y,this.visionRightSoft[0],this.visionRightSoft[1],Map.internal[i-1][0],Map.internal[i-1][1],Map.internal[i][0],Map.internal[i][1],true )
            if (this.visionRightSoft_hit.x != false) {
                this.visionRightSoft_where = [this.visionRightSoft_hit.x,this.visionRightSoft_hit.y];
                if(display_circle==true){
                    circle(this.visionRightSoft_hit.x,this.visionRightSoft_hit.y,20)// Optional
                }
            }
        }

        //Point impact full droite
        for (let i = 1; i < Map.external.length; i++) {
            this.visionRightHard_hit = collideLineLine(position.x,position.y,this.visionRightHard[0],this.visionRightHard[1],Map.external[i-1][0],Map.external[i-1][1],Map.external[i][0],Map.external[i][1],true )
            if (this.visionRightHard_hit.x != false) {
                this.visionRightHard_where = [this.visionRightHard_hit.x,this.visionRightHard_hit.y];
                if(display_circle==true){
                    circle(this.visionRightHard_hit.x,this.visionRightHard_hit.y,20)// Optional
                }
            }
        }
        for (let i = 1; i < Map.internal.length; i++) {
            this.visionRightHard_hit = collideLineLine(position.x,position.y,this.visionRightHard[0],this.visionRightHard[1],Map.internal[i-1][0],Map.internal[i-1][1],Map.internal[i][0],Map.internal[i][1],true )
            if (this.visionRightHard_hit.x != false) {
                this.visionRightHard_where = [this.visionRightHard_hit.x,this.visionRightHard_hit.y];
                if(display_circle==true){
                    circle(this.visionRightHard_hit.x,this.visionRightHard_hit.y,20)// Optional
                }
            }
        }
    }
    
    /*  IA    */
    think(pos, dir, vitesse){
        //Convert direction to vector
        let dir_vector = p5.Vector.fromAngle(dir);

        let inputs = [];
        inputs[0] = pos.x,pos.y;
        inputs[1] = dir_vector.x,dir_vector.y;
        inputs[2] = vitesse.x,vitesse.y;
        inputs[3] = this.visionLeftHard_where[0],this.visionLeftHard_where[1];
        inputs[4] = this.visionLeftSoft_where[0],this.visionLeftSoft_where[1];
        inputs[5] = this.visionAhead_where[0],this.visionAhead_where[1];
        inputs[6] = this.visionRightSoft_where[0],this.visionRightSoft_where[1];
        inputs[7] = this.visionRightHard_where[0],this.visionRightHard_where[1];
        let output = this.brain.predict(inputs);

        return output;
    }

    dispose() {
        this.brain.dispose();
    }

    mutate() {
        this.brain.mutate(mutation_rate);
    }
}