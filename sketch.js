// https://openprocessing.org/sketch/1274943
// https://twitter.com/okazz_/status/1440629255176474632

const maxGlobalRotate = Math.random() * Math.PI

class Arc {
  constructor(n) {
    this.aOffset = Math.random() * Math.PI*2
    this.rOffset = Math.random() * Math.PI*2
    this.range = {
      max: Math.PI/(n-1) + Math.PI/(n-1) * (0.5 + 0.5 * Math.random()),
      min: Math.PI/(n-1) * Math.random()
    }
    this.radius = {
      // 100 units, but real size will be set by display()
      max: 1,
      min:  0.1 + Math.random() * 0.4
    }
    this.hue = Math.round(Math.random() * 360)
  }
  get minRange() {
    return Math.round(this.range.min * 1000) / 1000
  }
  get maxRange() {
    return Math.round(this.range.max * 1000) / 1000
  }
  get minRadius() {
    return this.radius.min
  }
  get maxRadius() {
    return this.radius.max
  }
}

class ArcCircle {
  // circle consisting of n arcs
  // n - 1 arcs should measure max. 2 * Math.PI / n-1
  // the last arc fills the remaining space 
  constructor(n) {
    this.maxRotate = Math.random() * Math.PI * 2
    this.arcs = []
    this.lastArcHue = Math.round(Math.random() * 360)
    this.dotHue = Math.round(Math.random() * 360)
    for (let a = 0; a < n-1; a++) {
      this.arcs.push(new Arc(n))
    }
    /*
    let lastArc = this.arcs[this.arcs.length - 1]
    // range of lastArc needs to be set manually
    // no, this arc needs to get calculated ad hoc!
    lastArc.newRage = {
      max: Math.PI * 2 - this.arcs.map(a => a.maxRange).reduce((a, b) => a+b),
      min: Math.PI * 2 - this.arcs.map(a => a.minRange).reduce((a, b) => a+b)
    }
    */

  }
  display(fc, size) {
    // needs to be hookedUp to frameCount (fc)
    // s is the width/height
    push()
    rotate(map(sin(fc/50), -1, 1, 0, this.maxRotate))
    let remainingAngle = 2 * Math.PI
    for (let currentArc of this.arcs) {
      let aOsc = Math.sin(fc/40 + currentArc.aOffset)
      let rOsc = Math.sin(fc/32 + currentArc.rOffset)
      let renderedAngle = map(aOsc, -1, 1, currentArc.minRange, currentArc.maxRange)
      let renderedRadius = map(rOsc, -1, 1, currentArc.minRadius * size, currentArc.maxRadius * size)
      stroke(255)
      line(0, 0, size/2, 0)
      fill(this.dotHue, 100, 50)
      noStroke()
      ellipse(size/2, 0, size/10, size/10)

      colorMode(HSL, 360, 100, 100)
      fill(currentArc.hue, 100, 50) // each Arc needs a Hue
      arc(0, 0, renderedRadius, renderedRadius, 0, renderedAngle)
      rotate(renderedAngle)
      remainingAngle -= renderedAngle
    }
    // draw last line
    stroke(255)
    line(0, 0, size/2, 0)
    noStroke()
    fill(this.dotHue, 100, 50)
    ellipse(size/2, 0, size/10, size/10)

    // draw last arc
    let rOsc = Math.sin(fc/32)
    let renderedRadius = map(rOsc, -1, 1, 20, size)

    noStroke()
    fill(this.lastArcHue, 100, 50)
    arc(0, 0, renderedRadius, renderedRadius, 0, remainingAngle)
    pop()
  }
}

const foo = new ArcCircle(4)
const canvasSizeX = 1400
const canvasSizeY = 700
const shapes = []
const numCols = 16
const numRows = 8
const numCells = numCols * numRows
const cellSizeX = canvasSizeX / numCols
const cellSizeY = canvasSizeY / numRows

function setup() {
  createCanvas(canvasSizeX, canvasSizeY)
  for (let i = 0; i < numCells; i++) {
    let arcNum = Math.floor(Math.random() * 3) + 3
    shapes.push(new ArcCircle(arcNum))
  }
}

function draw() {
  background(0)
  // foo.display(frameCount, 250)
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      push()
      translate(col * cellSizeX + cellSizeX/2, row * cellSizeY + cellSizeY/2)
      // rect(-cellSizeX/2, -cellSizeY/2, cellSizeX, cellSizeY)
      let currentIndex = col + row * numCols
      shapes[currentIndex].display(frameCount, Math.min(cellSizeX, cellSizeY) * 0.7)
      pop()
    }
  }
}
  