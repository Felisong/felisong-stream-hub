
export function spawnCat(currentCat, windowHeight, windowWidth) {
  const playArea = window.document.getElementById("cat-play-area");
  const catContainer = document.createElement("div");
  const catName = document.createElement("p");
  const cat = document.createElement("div");

  catName.innerText = currentCat.name;

  cat.style.backgroundColor = currentCat.color;
  cat.style.borderRadius = "5px";
  cat.style.width = "50px";
  cat.style.height = "50px";

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