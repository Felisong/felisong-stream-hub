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
    maxDuration: 7,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "walk",
  },
  run: {
    id: 2,
    speed: 15,
    minDuration: 2,
    maxDuration: 5,
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
  lay: {
    id: 4,
    speed: 0,
    minDuration: 5,
    maxDuration: 10,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "lay",
  },
  sit: {
    id: 5,
    speed: 0,
    minDuration: 3,
    maxDuration: 10,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "sit",
  },
  stand: {
    id: 4,
    speed: 0,
    minDuration: 4,
    maxDuration: 7,
    hitbox: { h: 100, w: 100 },
    spriteFolder: "stand",
  },
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
    this.targetDuration = cat.targetDuration;
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

  enterState(newState) {
    this.state = newState;
    this.duration = 0;
    const cfg = stateConfig[newState];
    this.targetDuration =
      Math.random() * (cfg.maxDuration - cfg.minDuration) + cfg.minDuration;
    console.log(`new state selected! :`, newState, "successfully triggered.");
  }

  stateDuration(dt) {
    if (this.state === "spawn") return;

    this.duration += dt;
    if (this.duration > this.targetDuration) {
      const otherStates = Object.entries(stateConfig).filter(
        ([key]) => key !== this.state,
      );
      const [chosenKey] =
        otherStates[Math.floor(Math.random() * otherStates.length)];
      this.enterState(chosenKey);
    }
  }

  defaultStateManager(dt, windowHeight, windowWidth) {
    switch (this.state) {
      case "spawn":
        this.enterState("walk");
        break;
      case "walk":
        this.walk(dt);
        break;
      case "run":
        this.run(dt);
        break;
      case "jump":
        this.jump(dt);
        break;
      case "lay":
        this.still(dt);
        break;
      case "stand":
        this.still(dt);
        break;
      case "sit":
        this.still(dt);
        break;
      default:
        break;
    }
  }

  // walk, run, sit, lay... stand.
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
  // works for sit, lay and stand.
  still(dt) {
    const config = stateConfig.stand;
    this.velocity = {
      x: config.speed * this.direction,
      y: config.speed,
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
