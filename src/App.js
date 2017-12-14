import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    seed: ""
  }

  render() {
    let { seed } = this.state

    return (
      <div className="App">
        <Title>
            This simple app translates a string (e.g. your nickname)
            into a circular image. The same input is guaranteed
            to always produce the same output.
        </Title>
        <Identicon seed={seed} />
        <TextInput
          placeholder="Your nickname"
          onChange={evt => this.setState({ seed: evt.target.value })} />
        <SourceLink />
      </div>
    )
  }
}

export default App

class Identicon extends Component {
  state = {}

  componentDidMount() {
    this._update(this.props.seed)
  }

  componentWillReceiveProps(nextProps) {
    this._update(nextProps.seed)
  }

  async _update(seed) {
    let hash = await sha256(seed)
    this.setState({ hash })
  }

  _toggle_fill = () => {
    let { filled } = this.state
    this.setState({ filled: !filled })
  }

  render() {
    let { hash, filled } = this.state
    let content = null

    if (hash) {
      content = []
      let iterations = hash.length - 4
      for (let i = 0; i < iterations; i++) {
        let distance = range(hash[i], 5, 47)
        let angle = range(hash[i + 1], 15, 180)
        let width = range(hash[i + 2], 2, 5)
        let rotation = range(hash[i + 3], 0, 360)
        let color = `rgb(${hash[i]}, ${hash[i+1]}, ${hash[i+2]})`
        let fill = filled ? color : "none"
        let d = filled ? wing : arc

        content.push(
          <path key={i} transform={`rotate(${rotation})`}
            d={d(0, 0, distance, 0, angle)}
            fill={fill}
            stroke={color}
            strokeWidth={width} />
        )
      }
    }

    return (
      <svg className="Identicon"
        viewBox="0 0 100 100"
        onClick={this._toggle_fill}>
        <g transform="translate(50,50)">
          <circle cx="0" cy="0" r="2" fill="#f00" />
          {content}
        </g>
      </svg>
    )
  }
}

function Title(props) {
  return (<p className="Title" {...props} />)
}

function TextInput(props) {
  return (
    <input className="TextInput" type="text" {...props} />
  )
}

function SourceLink() {
  return (
    <a className="SourceLink" href="source.html">
      [source]
    </a>
  )
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

async function sha256(message) {
  const bytes = new TextEncoder('utf-8').encode(message)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
}