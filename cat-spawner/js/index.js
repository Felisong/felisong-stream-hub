"use strict";
import { Cats } from "./catClass.js";
const eventSource = new EventSource(
  "http://localhost:3000/projects/cat-spawner/events",
);
let activeCats = new Map([]);
let latestReward = {};
let windowWidth = 0;
let windowHeight = 0;
let lastTime;
let isSpecialState = false;
// i can make an array of colors it default can have and math.random one from it

// reads current events this will be how things will change
eventSource.onmessage = (e) => {
  const currentEvent = JSON.parse(e.data);
  console.log(`Event used`, currentEvent);
  // add a blocker so that it only does this if the event isn't a connection one.
  if (currentEvent.connected) return;
  // whenever there IS an event it will be redeemed by one person...
  const currentCat = activeCats.get(`${currentEvent.user}`);

  // y axis starts 5-100
  // x axis is 0-95
  if (!currentCat) {
    // if this is a new cat.  Creates the cat!
    const cat = new Cats({
      name: currentEvent.user,
      color: currentEvent.input || "white",
      xPos: 0,
      yPos: 100,
      scale: 1,
      state: "spawn",
      opacity: 100,
      direction: 1,
      velocity: { x: 0, y: 0 },
      duration: 0,
      targetDuration: 0
    });
    cat.spawnCat(windowHeight, windowWidth);
    activeCats.set(`${currentEvent.user}`, cat);
    return;
  }
  // cat exists.

  // read the event (melee mode, eat, lick etc*)
  // depending on name provide one variable that new stat
  // const newState = currentEvent value I read.

  // currentCat.state = newState; ?
};

eventSource.onerror = (e) => {
  console.log(`error on event!: `, e);
};

let run = 0;
// environmentLoop
function gameLoop(timestamp) {
  if (lastTime === undefined) lastTime = timestamp;

  // delta time in seconds
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  // function update here
  handleCatBehavior(dt);

  // if (run > 250) {
  //   console.log("NO MORE");
  //   return;
  // } else {
  requestAnimationFrame(gameLoop);
  // }
}

function handleCatBehavior(dt) {
  // 1 cat spawns..
  activeCats.forEach((c) => {
    // how long has the cat been in current state?
    c.stateDuration(dt);
    // INTENTION OF THE CAT
    c.defaultStateManager(dt, windowHeight, windowWidth);
    // move cat values where they are intended
    c.newPosition(dt);
    // check if cat has reached a limit
    c.borderHandler();
    // render cat
    c.render(windowHeight, windowWidth, dt);
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
