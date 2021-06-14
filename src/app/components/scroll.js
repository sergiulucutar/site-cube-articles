import gsap from 'gsap'

export default class Scroll {
  constructor ({
    element
  }) {
    this.element = element

    this.offset = {
      current: 0,
      start: 0,
      target: 0,
      step: 0.1,
      distance: 0,
      limit: this.element.clientHeight - window.innerHeight || 0
    }
  }

  getOffset () {
    return this.offset
  }

  update () {
    if (Math.abs(this.offset.target - this.offset.current) > this.offset.step * 0.1) {
      this.offset.current += (this.offset.target - this.offset.current) * this.offset.step
    }

    this.element.style.transform = `translate3d(0, ${this.offset.current}px, 0)`
  }

  /**
   * Event Handlers
   */

  onMouseWheel (normalizeData) {
    this.offset.target -= normalizeData.pixelY
    this.offset.target = gsap.utils.clamp(-this.offset.limit, 0, this.offset.target)
  }

  onTouchDown (event) {
    event.preventDefault()
    this.isTouchDown = true
    this.offset.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchMove (event) {
    if (!this.isTouchDown) {
      return
    }
    const touch = event.touches ? event.touches[0].clientY : event.clientY
    this.offset.target += touch - this.offset.start
    this.offset.target = gsap.utils.clamp(-this.offset.limit, 0, this.offset.target)
  }

  onTouchUp () {
    this.isTouchDown = false
  }

  onResize () {
    if (this.element) {
      this.offset.limit = this.element.clientHeight - window.innerHeight
    }
  }
}
