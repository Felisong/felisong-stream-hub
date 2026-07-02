"use strict";
import { spawnCat } from "./catHelpers.js";
import { Cats } from "./catClass.js";
const eventSource = new EventSource(
  "http://localhost:3000/projects/cat-spawner/events",
);
let activeCats = new Map([]);
let latestReward = {};
let windowWidth = 0;
let windowHeight = 0;
let lastTime;
// i can make an array of colors it default can have and math.random one from it

// reads current events this will be how things will change
eventSource.onmessage = (e) => {
  const currentEvent = JSON.parse(e.data);
  console.log(typeof currentEvent, currentEvent);
  // add a blocker so that it only does this is the event is what i want it to be
  if (currentEvent.connected) return;
  //   if (currentEvent.event.id !== '') return;
  // find the event name to do an if else statement. maybe a
  // const newState = currentEvent.event.name or something

  // y axis starts 5-100
  // x axis is 0-95
  if (!activeCats.get(`${currentEvent.user}`)) {
    // if this is a new cat.  Creates the cat!
    activeCats.set(`${currentEvent.user}`, {
      name: currentEvent.user,
      color: currentEvent.input || "white",
      xPos: 0,
      yPos: 100,
      scale: 1,
      state: "spawn",
      opacity: 100,
    });
  } else {
    // this is how I can update state later too.

    // state will have to come if a reward came in, we'll have an if else statement or switch statement above to sort which one it is
    activeCats.set(`${currentEvent.user}`, {
      ...activeCats.get(`${currentEvent.user}`), // keep existing fields
      color: currentEvent.input || "white", // overwrite only these
      opacity: 100,
      // state: value from message
    });
  }
  // create new cat
  // this function will be moved to inside the new cat later.
  spawnCat(activeCats.get(`${currentEvent.user}`), windowHeight, windowWidth);
};

eventSource.onerror = (e) => {
  console.log(`error on event!: `, e);
};

// environmentLoop
function gameLoop(timestamp) {
  if (lastTime === undefined) lastTime = timestamp;

  // delta time
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  // function update here
  updateCats();

  // function render here

  requestAnimationFrame(gameLoop);
}

function updateCats() {
  // this will update all the cat's co-ordinates

  activeCats.forEach((c) => {
    const cat = new Cats(c);

    cat.defaultStateManager();

    // update x co-ordinates values on object
    // update y co-ordinates values on object
  });
}

// window tracker
function windowTracker() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

requestAnimationFrame(gameLoop);
windowTracker();
window.addEventListener("resize", windowTracker);
