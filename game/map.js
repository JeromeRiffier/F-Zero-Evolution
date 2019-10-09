
class Map {
    constructor() {
        this.external = [[81, 298],[149, 89],[498, 31],[1081, 68],[1501, 343],[1358, 521],[1374, 655],[1160, 768],[945, 729],[931, 531],[786, 639],[487, 756],[190, 498],[53, 441],[81, 298]];
        this.internal = [[222, 299], [253, 212], [499, 167], [1036, 204], [1296, 374], [1212, 481], [1226, 578], [1139, 628], [1077, 614], [997, 377], [860, 410], [719, 516], [517, 597], [303, 407], [208, 358],[222, 299]];
    
        this.checkpointX1s = [130, 500, 1080, 1500, 1215, 1227, 1140, 1075, 860, 515, 306];
        this.checkpointY1s = [140, 33,  70,   345,  500,  580,  628,  618,  412, 600, 408];
        this.checkpointX2s = [255, 500, 1035, 1296, 1355, 1373, 1160, 942,  930, 485, 190];
        this.checkpointY2s = [210, 168, 203,  375,  525,  657,  770,  675,  530, 758, 498];

        this.draw = function () {
            this.road();
            this.checkpoint();
            this.start();
        }

        this.road = function () {
            //external
            stroke(128, 0, 0);
            strokeWeight(3);
            fill(255);
            beginShape();
            for (let i = 0; i < this.external.length; i++) {
                vertex(this.external[i][0], this.external[i][1]);
            }
            endShape(CLOSE);
            //internal
            fill(level.background_color_r, level.background_color_g, level.background_color_b);
            beginShape();
            for (let i = 0; i < this.internal.length; i++) {
                vertex(this.internal[i][0], this.internal[i][1]);
            }
            endShape(CLOSE);
        }

        this.start = function () {
            stroke(0, 204, 0);
            strokeWeight(3);
            line(this.external[0][0], this.external[0][1], this.internal[0][0], this.internal[0][1])
        }

        this.checkpoint = function () {
            for (let i = 0; i < this.checkpointX1s.length; i++) {
                noFill();
                stroke(192, 192, 192);
                strokeWeight(3);
                line(this.checkpointX1s[i], this.checkpointY1s[i], this.checkpointX2s[i], this.checkpointY2s[i])
            }
        }
    }
}

class map_old {//Mauvaise idée aussi #poubelle
    constructor() {

        this.Xs = [150, 200, 500, 1060, 1400, 1285, 1300, 1150, 1010, 990, 750, 500, 250, 130];
        this.Ys = [300, 150, 100, 136, 360, 500, 620, 700, 675, 400, 580, 680, 450, 400];

        this.roadMap = []
        this.external = [[81, 298],[149, 89],[498, 31],[1081, 68],[1501, 343],[1358, 521],[1374, 655],[1160, 768],[945, 729],[931, 531],[786, 639],[487, 756],[190, 498],[53, 441]];
        this.internal = [[222, 299], [253, 212], [499, 167], [1036, 204], [1296, 374], [1212, 481], [1226, 578], [1139, 628], [1077, 614], [997, 377], [860, 410], [719, 516], [517, 597], [303, 407], [208, 358]];


        for (var i = 0; i < this.Xs.length; i++) {
            this.roadMap[i] = createVector(this.Xs[i],this.Ys[i])
        }

        this.checkpointX1s = [130, 500, 1080, 1500, 1215, 1227, 1140, 1075, 860, 515, 306];
        this.checkpointY1s = [140, 33,  70,   345,  500,  580,  628,  618,  412, 600, 408];
        this.checkpointX2s = [255, 500, 1035, 1300, 1355, 1373, 1160, 942,  930, 485, 190];
        this.checkpointY2s = [210, 168, 203,  375,  525,  657,  770,  675,  530, 758, 498];

        this.roadSize = 140;
        this.draw = function () {
            this.road();
            this.checkpoint();
            this.start();
        }
        this.road = function () {
            //Dessin de l'exterieur de la route
            stroke(128, 0, 0);
            strokeWeight(this.roadSize);
            beginShape();
            for (let i = 0; i < this.Xs.length; i++) {
                vertex(this.Xs[i], this.Ys[i]);
            }
            endShape(CLOSE);

            //Dessin de l'interieur de la route 
            noFill();
            stroke(255);
            strokeWeight(135);
            beginShape();
            for (let i = 0; i < this.Xs.length; i++) {
                vertex(this.Xs[i], this.Ys[i]);
            }
            endShape(CLOSE);
        }
        this.start = function () {
            stroke(0, 204, 0);
            strokeWeight(3);
            line(this.Xs[0] - (this.roadSize / 2), this.Ys[0], this.Xs[0] + (this.roadSize / 2), this.Ys[0])
        }

        this.checkpoint = function () {
            for (let i = 0; i < this.checkpointX1s.length; i++) {
                noFill();
                stroke(128, 0, 0);
                strokeWeight(3);
                line(this.checkpointX1s[i], this.checkpointY1s[i], this.checkpointX2s[i], this.checkpointY2s[i])
            }
        }


    }

}

class map_arrondie {//A utilisé quand j'arriverais a tester les collision avec une courbe :/
    constructor() {

        this.Xs = [150, 200, 500, 1060, 1400, 1285, 1300, 1150, 1010, 990, 750, 500, 250, 130];
        this.Ys = [300, 150, 100, 136, 360, 500, 620, 700, 675, 400, 580, 680, 450, 400];

        this.checkpointX1s = [130,500,1080,1473,1215,1230,1150,1070,858, 515, 310];
        this.checkpointY1s = [140,33, 73,  360, 500, 592, 630, 642, 400, 615, 410];
        this.checkpointX2s = [255,500,1050,1327,1355,1365,1150,938, 928, 490, 190];
        this.checkpointY2s = [198,168,205, 377, 525, 640, 770, 675, 517, 748, 493];

        this.roadSize = 140;
        this.draw = function () {
            this.road();
            this.checkpoint();
            this.start();
        }
        this.road = function () {
            //Dessin de l'exterieur de la route  (rouge)
            stroke(128, 0, 0);
            strokeWeight(this.roadSize);
            beginShape();
            for (let i = 0; i < this.Xs.length; i++) {
                curveVertex(this.Xs[i], this.Ys[i]);
            }
            endShape(CLOSE);

            //Dessin de l'interieur de la route (blanc)
            noFill();
            stroke(255);
            strokeWeight(135);
            beginShape();
            for (let i = 0; i < this.Xs.length; i++) {
                curveVertex(this.Xs[i], this.Ys[i]);
            }
            endShape(CLOSE);
        }
        this.start = function () {
            stroke(0, 204, 0);
            strokeWeight(3);
            line(this.Xs[0] - (this.roadSize / 2), this.Ys[0], this.Xs[0] + (this.roadSize / 2), this.Ys[0])
        }

        this.checkpoint = function () {
            for (let i = 0; i < this.checkpointX1s.length; i++) {
                noFill();
                stroke(128, 0, 0);
                strokeWeight(3);
                line(this.checkpointX1s[i], this.checkpointY1s[i], this.checkpointX2s[i], this.checkpointY2s[i])
            }
        }


    }

}
