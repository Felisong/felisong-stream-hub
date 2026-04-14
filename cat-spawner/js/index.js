"use strict";
function environmentLoop() {
  const height = window.innerHeight;
  const width = window.innerWidth;

  console.log(`test: `, height, width);
}
environmentLoop();
window.addEventListener("resize", environmentLoop);
