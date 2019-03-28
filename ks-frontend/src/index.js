// Preloader
function randombg() {
  var random = Math.floor(Math.random() * 3) + 0;
  var bigSize = ["url('./assets/rollercoaster1.gif')",
    "url('./assests/rollercoaster2.gif')",
    "url('./assests/rollercoaster3.gif')"
  ];

  document.getElementById("loader").style.backgroundImage = bigSize[random];
}

function preloader() {
  setTimeout(showPage, 2500);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.querySelector("canvas").style.display = "block";
}
let ulTag = document.querySelector('ul')
let arrayOfLis;

ScoreAdaptor.getUsers().then(players => {
  //array
  // players

  for(let user of players){
    ulTag.innerHTML += `<li data-id="${user.id}" data-name="${user.name}" data-win="${user.win}" data-score="${user.score}">Name: ${user.name} Wins: ${user.win} High Score: ${user.score}</li>`
  }
  arrayOfLis = ulTag.querySelectorAll('li')
  })
