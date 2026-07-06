export class Cats {
  constructor(cat) {
    this.name = cat.name;
    this.color = cat.color;
    this.xPos = cat.xPos;
    this.yPos = cat.yPos;
    this.scale = cat.scale;
    this.state = cat.state;
    this.opacity = cat.opacity;
    this.direction = cat.direction;
    this.velocity = cat.velocity;
    // cat render properties
    this.container = null;
    this.body = null;
    this.nameLabel = null;
  }

  spawnCat(windowHeight, windowWidth) {
    const playArea = window.document.getElementById("cat-play-area");
    this.nameLabel = document.createElement("p");
    this.body = document.createElement("div");
    this.container = document.createElement("div");

    this.nameLabel.innerText = this.name;

    this.body.style.backgroundColor = this.color;
    this.body.style.borderRadius = "5px";
    this.body.style.width = "50px";
    this.body.style.height = "50px";

    this.container.style.position = "absolute";
    this.container.style.left = `0px`;
    this.container.style.top = `0px`;
    this.container.style.opacity = `0%`;

    this.container.appendChild(this.nameLabel);
    this.container.appendChild(this.body);

    playArea.appendChild(this.container);

    this.render(windowHeight, windowWidth);
  }

  defaultStateManager(dt, windowHeight, windowWidth) {
    switch (this.state) {
      case "spawn":
        this.state = "walk";
        this.walk(dt);
        break;
      case "walk":
        this.walk(dt);
        break;
      default:
        break;
    }
    this.render(windowHeight, windowWidth);
  }

  render(windowHeight, windowWidth, dt) {
    const catContainerDimensions = this.container.getBoundingClientRect();
    const translateX = Math.round((this.xPos / 100) * windowWidth);
    const translateY = Math.round(
      (this.yPos / 100) * windowHeight - catContainerDimensions.height,
    );

    // child now exists. position
    this.container.style.transform = `translate(${translateX}px, ${translateY}px)`;
    this.container.style.opacity = `${this.opacity}%`;
    this.body.style.backgroundColor = `${this.color}`;
  }

  // TODO: so things are good but figure out how this velocity works best. I really want this to work well. and scale well. I left everythign rendering correctly so its figuring out states currently.
  // STATE HANDLERS
  walk(dt) {
    this.velocity = {
      x: 1,
      y: 0,
    };
  }
}
