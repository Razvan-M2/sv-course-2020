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

const GeorgeAsset = new Image();
GeorgeAsset.src = 'assets/george.png';
const George = {
    xPos: 0,
    yPos: 0,
    height: 48,
    width: 48,
    orientation: 0,
    iteratedRowPose: 0
}

GeorgeAsset.onload = () => {
    context.drawImage(GeorgeAsset, 0 * George.width, 0 * George.height, George.width, George.height, George.xPos, George.yPos, George.width, George.height);
}

var runningFunction = (event) => {
    context.clearRect(0, 0, 800, 600);

    var step = 15;

    switch (event.key) {
        case 'ArrowUp': {

            if (George.orientation == 2) {
                George.iteratedRowPose += 2;
                if (George.iteratedRowPose > 3)
                    George.iteratedRowPose = 1;

            }

            George.orientation = 2;

            if (George.yPos > 0)
                George.yPos -= step;
            break;
        }
        case 'ArrowDown': {

            if (George.orientation == 0) {
                George.iteratedRowPose += 2;
                if (George.iteratedRowPose > 3)
                    George.iteratedRowPose = 1;
            }
            George.orientation = 0;

            if (George.yPos + George.height + 10 < 600)
                George.yPos += step;
            break;
        }
        case 'ArrowLeft': {

            if (George.orientation == 1) {
                George.iteratedRowPose += 2;
                if (George.iteratedRowPose > 3)
                    George.iteratedRowPose = 1;
            }
            George.orientation = 1;

            if (George.xPos > 0)
                George.xPos -= step;
            break;
        }
        case 'ArrowRight': {

            if (George.orientation == 3) {
                George.iteratedRowPose += 2;
                if (George.iteratedRowPose > 3)
                    George.iteratedRowPose = 1;
            }
            George.orientation = 3;

            if (George.xPos + George.width + 10 < 800)
                George.xPos += step;
            break;
        }
    }
    context.drawImage(GeorgeAsset, George.orientation * George.width, George.iteratedRowPose * George.height, George.width, George.height, George.xPos, George.yPos, George.width, George.height);
}

document.addEventListener("keydown", runningFunction);
