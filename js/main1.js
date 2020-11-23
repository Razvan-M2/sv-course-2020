//  Exercise 1

var arr1 = ["Love", "I", "Javascript"];

//  Am omis metoda clasica cu o variabila auxiliara, am folosit metode de array-uri

arr1.unshift(arr1[1]);
arr1.splice(2, 1);

//  Am invatat de alta metoda la care nu m-am gandit initial, object destructuring

//  [arr1[0], arr1[1]] = [arr1[1], arr1[0]]


//  Exercise 2

var arr2 = ["Paul", 1, false, { name: "Jon Snow" }, [1, 2, 3], null, undefined, function () { console.log('Test') }];

arr2.forEach((element, index) => {
    console.log('Element at position ' + index + ' is of type ' + typeof (element) + ", it's content is : ");
    console.log(element);
});

// Exercise 3

/** @type {CanvasRenderingContext2D} */

const canvas = document.getElementById('interractiveCanvas');
const context = canvas.getContext('2d');

const MarioAsset = new Image();
MarioAsset.src = 'assets/mario-2.png';
const Mario = {
    xPos: 0,
    yPos: 0,
    height: 38,
    width: 32,
    orientation: 0,
    iteratedRowPose: 0
}

MarioAsset.onload = () => {
    context.drawImage(MarioAsset, 0 * Mario.width, 0 * Mario.height, Mario.width, Mario.height, Mario.xPos, Mario.yPos, Mario.width, Mario.height);
}

var runningFunction = (event) => {
    context.clearRect(0, 0, 800, 600);

    var step = 15;
    var iterativeLimit = 7;

    switch (event.key) {
        case 'ArrowUp': {

            if (Mario.orientation == 4) {
                Mario.iteratedRowPose += 2;
                if (Mario.iteratedRowPose > iterativeLimit)
                    Mario.iteratedRowPose = 1;

            }

            Mario.orientation = 4;

            if (Mario.yPos > 0)
                Mario.yPos -= step;
            break;
        }
        case 'ArrowDown': {

            if (Mario.orientation == 0) {
                Mario.iteratedRowPose += 2;
                if (Mario.iteratedRowPose > iterativeLimit)
                    Mario.iteratedRowPose = 1;
            }
            Mario.orientation = 0;

            if (Mario.yPos + Mario.height + 10 < 600)
                Mario.yPos += step;
            break;
        }
        case 'ArrowLeft': {

            if (Mario.orientation == 6) {
                Mario.iteratedRowPose += 2;
                if (Mario.iteratedRowPose > iterativeLimit)
                    Mario.iteratedRowPose = 1;
            }
            Mario.orientation = 6;

            if (Mario.xPos > 0)
                Mario.xPos -= step;
            break;
        }
        case 'ArrowRight': {

            if (Mario.orientation == 2) {
                Mario.iteratedRowPose += 2;
                if (Mario.iteratedRowPose > iterativeLimit)
                    Mario.iteratedRowPose = 1;
            }
            Mario.orientation = 2;

            if (Mario.xPos + Mario.width + 10 < 800)
                Mario.xPos += step;
            break;
        }
    }
    context.drawImage(MarioAsset, Mario.iteratedRowPose * Mario.width, Mario.orientation * Mario.height, Mario.width, Mario.height, Mario.xPos, Mario.yPos, Mario.width, Mario.height);
}

document.addEventListener("keydown", runningFunction);
