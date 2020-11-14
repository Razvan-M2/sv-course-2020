var dumyObject = {
    height: 600,
    width: 400,
    color: "It has no colour yet",
    isCanvas: true
}

var functionVariable = (name) => {
    return "Buna, numele meu este " + name;
}


console.log("The object's properties are:\nThe height is : " + dumyObject.height + 
            "\nThe width is : " + dumyObject.width + 
            "\nThe color is : " + dumyObject.color +
            "\nIs it that canvas? " + (dumyObject.isCanvas ? "Yes.." : "No..") );


console.log(functionVariable("Razvan"));