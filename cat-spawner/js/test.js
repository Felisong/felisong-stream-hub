function step(timestamp) {
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start; // ms since animation began

  const shift = Math.min(0.1 * elapsed, 200); // 0.1px per ms
  element.style.transform = `translateX(${shift}px)`;

  if (shift < 200) {
    requestAnimationFrame(step); // must re-call — it only fires once
  }
}

// State that lives OUTSIDE the loop, persists across calls
// player co-ordinates
const player = { x: 0, y: 0, vx: 0, vy: 0 };
// is an object of all keys that have been pressed. If that key is active, its true. Else its false/
const keys = {}; // tracks what's currently pressed

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// define lastTime but is undefined on load
let lastTime;

// gameLoop receives timeStamp from requestAnimationFrame()
function gameLoop(timestamp) {
  // if lastTime is undefined, make lastTime into the first timestamp we receive
  if (lastTime === undefined) lastTime = timestamp;

  // dt stands for??? Idk but doesnt matter, its just the value that finds the amount of time has passed since this function was last triggered
  const dt = timestamp - lastTime;

  //update lastTime now to be the timestamp for future runs
  lastTime = timestamp;
  // update position depending on inputs
  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // i have the amount of time that has passed since the previous run.

  // read current input state, apply it to player state
  if (keys["ArrowRight"]) player.vx = 0.2;
  else if (keys["ArrowLeft"]) player.vx = -0.2;
  else player.vx = 0;

  // then for y i would just repeat the above liness.

  // the value to move * the amount of time (so yea this makes it not matter if different hz exist. just by time.)
  player.x += player.vx * dt; // move based on elapsed time, not frame count
}

function render() {
  // render it on the browser
  playerEl.style.transform = `translateX(${player.x}px)`;
  // sme line but for y
}


//Do I not need to run requestAnimationFrame(gameLoop) anywhere out here to start it?