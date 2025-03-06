export class MouseController {
  constructor(model) {
    this.model = model;
  }

  handleMouseMove(e) {
    this.model.updatePosition(e.clientX, e.clientY);
  }

  handleScroll() {
    this.model.updateScroll(window.scrollY);
  }

  setupEventListeners() {
    const mouseMoveHandler = (e) => this.handleMouseMove(e);
    const scrollHandler = () => this.handleScroll();

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }
}