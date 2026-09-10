"use strict";
import { Cats } from "./catClass.js";
import { createNewReward, refundReward } from "./fetches.js";
const eventSource = new EventSource(
  "http://localhost:3000/projects/cat-spawner/events",
);
let activeCats = new Map([]);
let windowWidth = 0;
let windowHeight = 0;
let lastTime;

const rewardHandlers = {
  "f4405acb-2e84-448e-8d4b-d9ace5ff55a6": (cat, currentEvent) => {
    // if both are true, a cat already exists.
    if (cat)
      return { message: "Cat already exists! Points refunded.", refund: true };

    // y axis starts 5-100
    // x axis is 0-95
    // if this is a new cat.  Creates the cat!
    const currentCat = new Cats({
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
      targetDuration: 0,
      latestReward: currentEvent,
    });
    currentCat.spawnCat(windowHeight, windowWidth);
    activeCats.set(`${currentEvent.user}`, currentCat);

    // all special state rewards.
    // createNewReward("Lick", 10); //  lick chat,
    // zoomies
    // feed
    // ? i dont remember
    // melee mode

    return { refund: false };
  },
  "special-state-1": (cat, event) => {
    if (!cat)
      return {
        message:
          "Your cat doesn't exist yet! Please use 'Spawn Cat' reward first. Points refunded.",
        refund: true,
      };

    //change cats state manually?
  },
};
// i can make an array of colors it default can have and math.random one from it

// reads current events this will be how things will change
eventSource.onmessage = async (e) => {
  const currentEvent = JSON.parse(e.data);
  // console.log(`Event used`, currentEvent);
  // add a blocker so that it only does this if the event isn't a connection one.
  if (currentEvent.connected) return;
  // loads up the function with the id picked as key
  const handler = rewardHandlers[currentEvent.reward.id];
  if (!handler) return; // unrelated/unmapped reward

  const currentCat = activeCats.get(currentEvent.user);
  // trigger function on specific cat
  const result = await handler(currentCat, currentEvent);
  if (result?.refund) {
    const res = await refundReward(currentEvent);
    // can i make twitch send a chat message here?
  }
};

eventSource.onerror = (e) => {
  console.log(`error on event!: `, e);
};

// helper to limit behavior for future troubleshooting.
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
