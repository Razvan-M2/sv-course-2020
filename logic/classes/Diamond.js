const RIGHT_EDGE = 940;
const DOWN_EDGE = 620;

// Tema .1
const LIMITS = {
    LEFT: 195,
    UP: 191,
    RIGHT: 742,
    DOWN: 451
}
//  Returnam true daca diamantul nu se afla in perimetrul unei baze
function checkCondition(x, y) {
    if (x > LIMITS.LEFT) {
        if (x < LIMITS.RIGHT) {
            return true;
        } else {
            if (y < LIMITS.DOWN) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        if (y > LIMITS.UP) {
            if (y < LIMITS.DOWN) {
                return true;
            } else {
                if (x > LIMITS.RIGHT) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }
}
//
class Diamond {
    constructor() {
        // Tema .1
        do {
            this.x = Math.floor(Math.random() * RIGHT_EDGE);
            this.y = Math.floor(Math.random() * DOWN_EDGE);
        } while (!checkCondition(this.x, this.y))
        //
        this.imageId = 'diamond';
        this.width = 26;
        this.height = 21;
    }

    forDraw() {
        return {
            imageId: this.imageId,
            drawImageParameters: [
                this.x,
                this.y
            ]
        }
    }
}

module.exports = Diamond;