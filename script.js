let imageFileInput = document.querySelector("#imageFileInput");
let canvas = document.getElementById("meme");
let bottomTextInput = document.getElementById("bottomText");
let topTextInput = document.getElementById("topText");
let showSaveButt = document.getElementById("savememe");


let image;

imageFileInput.addEventListener("change", () => {
  let imageData = URL.createObjectURL(imageFileInput.files[0]);
  image = new Image();
  image.src= imageData;

  image.addEventListener("load", () => {
    showSaveMemeButt();
    updateCanvas(canvas, image, topTextInput.value, bottomTextInput.value);
  }, {once: true});


})

function showSaveMemeButt(){
  let showSaveButtClass = showSaveButt.classList.contains(".savememebutt");
 
  if (showSaveButtClass === true){
    console.log("hejdå")
    showSaveButt.classList.remove(".savememebutt");
  }
  else {
    console.log("hej")
  }

}


function updateCanvas(canvas, image, topText, bottomText) {
  let ctx = canvas.getContext("2d");
  let canvasWidth = image.width;
  let canvasHeight = image.height;
  let fontSize = Math.floor(canvasWidth/10);
  let yOff = canvasHeight/25;
  
  //new background:
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.drawImage(image, 0, 0);

  //TEXT (math.floor = helt nummer)
  ctx.strokeStyle = "black";
  ctx.lineWidth = Math.floor(fontSize/4);
  ctx.fillStyle ="white";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.font = `${fontSize}px Courier`; 
  ctx.fontletterSpacing = "0.8rem"

  //Text 1
  ctx.textBaseline = "top";
  ctx.strokeText(topText, canvasWidth/2, yOff);
  ctx.fillText(topText, canvasWidth / 2, yOff);

  //text 2
  ctx.textBaseline = "bottom";
  ctx.strokeText(bottomText, canvasWidth / 2, canvasHeight - yOff);
  ctx.fillText(bottomText, canvasWidth / 2, canvasHeight - yOff);
}


