"use strict";
let activeCats = new Map([]);
const eventSource = new EventSource(
  "http://localhost:3000/projects/cat-spawner/events",
);
let latestReward = {};
// i can make an array of colors it default can have and math.random one from it

// reads current events
eventSource.onmessage = (e) => {
  const currentEvent = JSON.parse(JSON.stringify(e.data));
  // add a blocker so that it only does this is the event is what i want it to be
  //   if (currentEvent.event.id !== '') return;
  // I had a cat object I can set up right here.
  console.log(`event: ${currentEvent}`);
  activeCats.set(`${currentEvent.user}`, {
   name: currentEvent.user,
   color: currentEvent.input || 'white',
   xPos: 0,
   yPos: 0,
   scale: 1,

  });
  console.log(`got the message and updated cats`);
  const info = window.document.getElementById("info");
  // info.innerHTML = String(activeCats.get(currentEvent.username));
};
eventSource.onerror = (e) => {
  // console.log(`error! ${JSON.stringify(e)}`);
};

// environment loop
function environmentLoop() {
  const height = window.innerHeight;
  const width = window.innerWidth;

  console.log(`test: `, height, width);
}
environmentLoop();
window.addEventListener("resize", environmentLoop);
