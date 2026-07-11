// variable to store the default cat size min/max x: co ordinates  , cat y min/max y: co ordinates
const catDefaultMaxMin = {
  x: {
    min: 0,
    max: 95,
  },
  y: {
    min: 0,
    max: 100,
  },
};
const stateConfig = {
  walk: {
    id: 1,
    speed: 5,
    minDuration: 2,
    maxDuration: 20,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "walk",
  },
  run: {
    id: 2,
    speed: 15,
    minDuration: 3,
    maxDuration: 9,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "run",
  },
  jump: {
    id: 3,
    speed: 4,
    minDuration: 1,
    maxDuration: 1,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "jump",
  },
  // put all state configs in here
};

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
    // state duration
    this.duration = cat.duration;
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
    this.body.style.width = "90px";
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

  stateDuration(dt) {
    if (this.state === "spawn") return;

    const currentState = stateConfig[this.state];
    this.duration += dt;
    if (
      this.duration >
      Math.random() * (currentState.maxDuration - currentState.minDuration) +
        currentState.minDuration
    ) {
      // if the duration so far is longer than the first instance of the random seconds passed from min max...\

      // Source - https://stackoverflow.com/a/16976940
      // Posted by Barmar, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-07-10, License - CC BY-SA 3.0
      // chosen id equals a random # from 1 & the length of the obect entries (3)
      let chosenId =
        Math.floor(Math.random() * Object.keys(stateConfig).length) + 1;
      const states = Object.entries(stateConfig).forEach(([key, val]) => {
        if (val.id === chosenId) {
          this.state = key;
        }
      });
    }
    // else state stays the same
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
      case "jump":
        this.jump(dt);
        break;
      default:
        break;
    }
  }

  // STATE HANDLERS
  walk(dt) {
    const config = stateConfig.walk;
    // speed comes from the config (moves 2 unites forward), we get velocity here by * the speed (2 * 1). 1 is right -1 is left.
    this.velocity = {
      x: config.speed * this.direction,
      y: 0,
    };
  }

  run(dt) {
    const config = stateConfig.run;

    this.velocity = {
      x: config.speed * this.direction,
      y: 0,
    };
  }

  jump(dt) {
    const config = stateConfig.jump;

    this.velocity = {
      x: (config.speed * this.direction) / 0.8,
      y: !config.speed,
    };
  }

  newPosition(dt) {
    this.xPos += this.velocity.x * dt;
    this.yPos += this.velocity.y * dt;
  }

  borderHandler() {
    if (this.xPos > 95) {
      this.xPos = 95;
      this.direction = -1;
    } else if (this.xPos < 0) {
      this.xPos = 0;
      this.direction = 1;
    }
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
}
