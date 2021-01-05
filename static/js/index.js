// let name = prompt("Welcome to Food Hub", "Guest");

// let x = document.getElementById('welcomemsg');
// if(name == "Guest"){
//     x.innerText = `Hello, Welcome to Food Hub.`;
// }else{
//     x.innerText = `Hello ${name},
//     Welcome to Food Hub.
//     `;
// }

// let rating = document.getElementById("rating");

// let rate = document.getElementById("rate");

// rating.click = function (){
    
//     console.log(rating.value);
// }
// // rate.innerText = rating.value
// console.log("script added successfully");



var picPaths = ['img/index/8.webp', 'img/index/2.webp', 'img/index/3.webp', 'img/index/4.webp', 'img/index/5.webp', 'img/index/6.webp', 'img/index/7.jpg', 'img/index/8.webp', 'img/index/9.webp', 'img/index/10.webp', 'img/index/11.webp', 'img/index/12.webp' ];
var curPic = -1;
//preload the images for smooth animation
var imgO = new Array();
for(i=0; i < picPaths.length; i++) {
    imgO[i] = new Image();
    imgO[i].src = picPaths[i];
}

function swapImage() {
    curPic = (++curPic > picPaths.length-1)? 0 : curPic;
    imgCont.src = imgO[curPic].src;
    setTimeout(swapImage,5000);
}

window.onload=function() {
    imgCont = document.getElementById('imgBanner');
    swapImage();
 
}



// button.onclick = function (){
//     window.alert("Thank You For Your Suggestion:)")
// }