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
  // y axis starts 5-100
  // x axis is 0-95
  if (!activeCats.get(`${currentEvent.user}`)) {
    // if this is a new cat.  Creates the cat!
    activeCats.set(`${currentEvent.user}`, {
      name: currentEvent.user,
      color: currentEvent.input || "white",
      xPos: 95,
      yPos: 100,
      scale: 1,
      state: "spawn",
      opacity: 100,
    });
  } else {
    // this is how I can update position later too.
    activeCats.set(`${currentEvent.user}`, {
      ...activeCats.get(`${currentEvent.user}`), // keep existing fields
      color: currentEvent.input || "white", // overwrite only these
      opacity: 100,
    });
  }

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

  catName.innerText = currentCat.name;

  cat.style.backgroundColor = currentCat.color;
  cat.style.borderRadius = "5px";
  cat.style.width = "50px";
  cat.style.height = "50px";
  // how do i spawn it in the bottom right?

  catContainer.style.position = "absolute";
  catContainer.style.left = `0px`;
  catContainer.style.top = `0px`;
  catContainer.style.opacity = `0%`;

  catContainer.appendChild(catName);
  catContainer.appendChild(cat);

  playArea.appendChild(catContainer);
  const catContainerDimensions = catContainer.getBoundingClientRect();
  const translateX = Math.round((currentCat.xPos / 100) * windowWidth);
  const translateY = Math.round(
    (currentCat.yPos / 100) * windowHeight - catContainerDimensions.height,
  );

  // child now exists. position
  catContainer.style.transform = `translate(${translateX}px, ${translateY}px)`;
  catContainer.style.opacity = `${currentCat.opacity}%`;
}






// environment loop
function environmentLoop() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}
environmentLoop();
window.addEventListener("resize", environmentLoop);
