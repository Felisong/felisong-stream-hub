"use strict";
const eventSource = new EventSource(
  "http://localhost:3000/projects/cat-spawner/events",
);
let activeCats = new Map([]);
let latestReward = {};
let windowWidth = 0;
let windowHeight = 0;
// i can make an array of colors it default can have and math.random one from it

// reads current events
eventSource.onmessage = (e) => {
  const currentEvent = JSON.parse(e.data);
  console.log(typeof currentEvent, currentEvent);
  // add a blocker so that it only does this is the event is what i want it to be
  if (currentEvent.connected) return;
  //   if (currentEvent.event.id !== '') return;
  // I had a cat object I can set up right here.
  console.log(`event:`, currentEvent);
  activeCats.set(`${currentEvent.user}`, {
    name: currentEvent.user,
    color: currentEvent.input || "white",
    xPos: 90,
    yPos: 90,
    scale: 1,
    state: "spawn",
  });
  console.log(`got the message and updated cats`);

  // create new cat
  spawnCat(activeCats.get(`${currentEvent.user}`));
};
eventSource.onerror = (e) => {
  // console.log(`error! ${JSON.stringify(e)}`);
};

function spawnCat(currentCat) {
  console.log(`current cat:`, currentCat);
  console.log(`window dimensions: `, windowHeight, windowWidth);
  const playArea = window.document.getElementById("cat-play-area");
  const catContainer = document.createElement("div");
  const catName = document.createElement("p");
  const cat = document.createElement("div");
  const catContainerDimensions = catContainer.getBoundingClientRect();

  
  catName.innerText = currentCat.name;

  cat.style.backgroundColor = currentCat.color;
  cat.style.borderRadius = "5px";
  cat.style.width = "50px";
  cat.style.height = "50px";
  // how do i spawn it in the bottom right?

  catContainer.style.position = "absolute";
  catContainer.style.left = `0px`;
  catContainer.style.top = `0px`;
  catContainer.style.transform = `translate(${Math.round((currentCat.xPos / 100) * windowWidth)}px, ${Math.round((currentCat.yPos / 100) * windowHeight)}px)`;

  catContainer.appendChild(catName);
  catContainer.appendChild(cat);

  playArea.appendChild(catContainer);
}

// environment loop
function environmentLoop() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}
environmentLoop();
window.addEventListener("resize", environmentLoop);
