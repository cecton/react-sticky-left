import * as React from "react"
import * as Rx from "rxjs"

class StickyLeft extends React.Component {
  render() {
    const { children } = this.props
    return [
      (<div key="anchor" ref="anchor"/>),
      (<div key="content" ref="content">{children}</div>),
    ]
  }

  componentDidMount() {
    const { container } = this.props
    setTimeout(() => {
      const element = container()
      const { anchor, content } = this.refs
      console.log(element)
      Rx.Observable.merge(
        Rx.Observable.fromEvent(element, "scroll"),
        Rx.Observable.fromEvent(window, "scroll"),
        Rx.Observable.interval(0).take(1))
        .debounce(() => Rx.Observable.interval(0, Rx.Scheduler.animationFrame))
        .subscribe(() => {
          const { offsetLeft, offsetTop } = anchor
          const { clientWidth, clientHeight } = content
          const left = offsetLeft - window.pageXOffset
          const top = offsetTop - window.pageYOffset
          content.setAttribute("style", `
            position: fixed;
            width: ${clientWidth}px;
            height: ${clientHeight}px;
            left: ${left}px;
            top: ${top}px;
          `)
          anchor.setAttribute("style", `
            margin-right: ${clientWidth}px;
            margin-bottom: ${clientHeight}px;
          `)
        })
    }, 0)
  }
}

const frozenColumnStyle = {
  height: "100%",
  width: "200px",
  background: "linear-gradient(to right, yellow, red)",
  flexShrink: 0,
  // NOTE: what we are trying to emulate:
  //position: "sticky",
  //left: 0,
}

const FrozenColumn = () => (
  <div style={frozenColumnStyle} />
)

const contentStyle = {
  height: "100%",
  width: "1000px",
  background: "linear-gradient(to right, black, white)",
  flexShrink: 0,
}

const Content = () => (
  <div style={contentStyle} />
)

const appStyle = {
  width: "600px",
  height: "300px",
  display: "flex",
  overflow: "auto",
  margin: "40px",
}

class App extends React.Component {
  render() {
    return (
      <div style={{ width: 2000, height: 4000 }}>
        <div className="App" style={appStyle} ref="container">
          <StickyLeft container={this.findContainer}>
            <FrozenColumn />
          </StickyLeft>
          <Content />
        </div>
      </div>
    )
  }

  findContainer = () => this.refs.container
}

export default App;
