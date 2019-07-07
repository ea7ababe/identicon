'use strict'

export class Arcs {
  constructor(root, flags = {}) {
    if (!root) {
      this.root = create_svg_element(null, 'svg', { viewBox: '0 0 100 100' })
    } else if (typeof root == 'string') {
      this.root = document.querySelector(root)
      if (!this.root) {
        throw "cannot find element"
      }
    } else if (root instanceof SVGElement) {
      this.root = root
    } else {
      throw "invalid root parameter; expected a string selector or an SVGElement"
    }

    this.fill = flags.fill
  }

  async render(seed) {
    let { root } = this
    let hash = await sha256(seed)
    let iterations = hash.length - 4

    clear_element(root)

    let g = create_svg_element(root, 'g', { transform: 'translate(50,50)' })
    let center = create_svg_element(g, 'circle', { cx: '0', cy: '0', r: '2', fill: '#f00' })

    for (let i = 0; i < iterations; i++) {
      let distance = range(hash[i], 5, 47)
      let angle = range(hash[i + 1], 15, 180)
      let width = range(hash[i + 2], 2, 5)
      let rotation = range(hash[i + 3], 0, 360)
      let color = `rgb(${hash[i]}, ${hash[i+1]}, ${hash[i+2]})`
      let fill = this.fill ? color : 'none'
      let d = this.fill ? wing : arc

      create_svg_element(g, 'path', {
        transform: `rotate(${rotation})`,
        d: d(0, 0, distance, 0, angle),
        fill: fill,
        stroke: color,
        stroke_width: width
      })
    }
  }
}

function range(x, start, end) {
  let max = end - start
  return (x / 0xFF) * max + start
}

function arc(x, y, radius, start_angle, end_angle) {
  var start = to_cartesian(x, y, radius, end_angle)
  var end = to_cartesian(x, y, radius, start_angle)
  var large = end_angle - start_angle <= 180 ? "0" : "1"

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, large, 0, end.x, end.y
  ].join(" ")

  return d
}

function wing(x, y, radius, start_angle, end_angle) {
  var start = to_cartesian(x, y, radius, end_angle)
  var end = to_cartesian(x, y, radius, start_angle)
  var large = end_angle - start_angle <= 180 ? "0" : "1"

  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, large, 0, end.x, end.y,
    "z"
  ].join(" ")
}

function to_cartesian(cx, cy, r, degrees) {
  var radians = (degrees - 90) * Math.PI / 180.0

  return {
    x: cx + (r * Math.cos(radians)),
    y: cy + (r * Math.sin(radians))
  }
}

function clear_element(e) {
  while (e.firstChild) e.removeChild(e.firstChild)
}

function create_svg_element(parent, tag, attrs) {
  const svgns = "http://www.w3.org/2000/svg";

  let element = document.createElementNS(svgns, tag)
  for (let key in attrs) {
    element.setAttribute(key.replace('_', '-'), attrs[key])
  }
  if (parent) parent.appendChild(element)
  return element
}

async function sha256(message) {
  const bytes = new TextEncoder('utf-8').encode(message)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
}
