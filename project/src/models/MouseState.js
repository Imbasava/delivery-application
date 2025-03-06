export class MouseStateModel {
  constructor() {
    this.state = {
      position: { x: 0, y: 0 },
      lastPosition: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      scrollY: 0
    };
  }

  getState() {
    return this.state;
  }

  updatePosition(clientX, clientY) {
    const newX = (clientX / window.innerWidth) * 100;
    const newY = (clientY / window.innerHeight) * 100;

    this.state.velocity = {
      x: newX - this.state.lastPosition.x,
      y: newY - this.state.lastPosition.y
    };

    this.state.lastPosition = { x: newX, y: newY };
    this.state.position = { x: newX, y: newY };
  }

  updateScroll(scrollY) {
    this.state.scrollY = scrollY;
  }

  getVelocityFactor() {
    return Math.sqrt(
      Math.pow(this.state.velocity.x, 2) + 
      Math.pow(this.state.velocity.y, 2)
    ) * 2;
  }

  getMoveX() {
    return (this.state.position.x - 50) * 0.1;
  }

  getMoveY() {
    return (this.state.position.y - 50) * 0.1;
  }
}