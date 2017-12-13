import * as React from "react"
import * as Rx from "rxjs"

class StickyLeft extends React.Component {
  render() {
    const { children } = this.props
    return [
      (<div key="anchor" ref="anchor" className="anchor"/>),
      (<div key="content" ref="content" className="content">
        <div key="wrapper" ref="wrapper" className="wrapper">{children}</div>
      </div>),
    ]
  }

  componentDidMount() {
    const { container } = this.props
    setTimeout(() => {
      const element = container()
      const { anchor, content, wrapper } = this.refs
      console.log(element)
      Rx.Observable.merge(
        Rx.Observable.fromEvent(element, "scroll"),
        Rx.Observable.fromEvent(window, "scroll"),
        Rx.Observable.interval(0).take(1))
        .debounce(() => Rx.Observable.interval(0, Rx.Scheduler.animationFrame))
        .subscribe(() => {
          const { clientWidth, clientHeight } = wrapper.firstChild
          const style = window.getComputedStyle(wrapper.firstChild)
          let contentStyle = `
            position: fixed;
            overflow: hidden;
            box-sizing: border-box;
            width: ${clientWidth}px;
            max-width: ${clientWidth}px;
            height: ${clientHeight}px;
            max-height: ${clientHeight}px;
          `
          let wrapperStyle = ""
          if (style.left !== "auto") {
            const left = element.offsetLeft - window.pageXOffset
            contentStyle += `left: calc(${left}px + ${style.left});`
          } else if (style.right !== "auto") {
            const left = element.offsetLeft - window.pageXOffset + element.clientWidth - clientWidth
            contentStyle += `left: calc(${left}px - ${style.right});`
          } else {
            const left = anchor.offsetLeft - window.pageXOffset
            contentStyle += `left: ${left}px;`
            wrapperStyle += `margin-left: -${element.scrollLeft}px;`
          }
          if (style.top !== "auto") {
            const top = element.offsetTop - window.pageYOffset
            contentStyle += `top: calc(${top}px + ${style.top});`
          } else if (style.bottom !== "auto") {
            const top = element.offsetTop - window.pageYOffset + element.clientHeight - clientHeight
            contentStyle += `top: calc(${top}px - ${style.bottom});`
          } else {
            const top = anchor.offsetTop - window.pageYOffset
            contentStyle += `top: ${top}px;`
            wrapperStyle += `margin-top: -${element.scrollTop}px;`
          }
          content.setAttribute("style", contentStyle)
          wrapper.setAttribute("style", wrapperStyle)
          anchor.setAttribute("style", `
            min-width: ${clientWidth}px;
            min-height: ${clientHeight}px;
          `)
        })
    }, 0)
  }
}

const frozenColumnStyle = {
  height: "150px",
  width: "200px",
  background: "linear-gradient(to right, yellow, transparent)",
  flexShrink: 0,
  // NOTE: what we are trying to emulate:
  //position: "sticky",
  left: 20,
  top: 20,
}

const FrozenColumn = ({ style }) => (
  <div id="left" style={{ ...frozenColumnStyle, ...style }} />
)

const frozenColumnStyleRight = {
  height: "150px",
  width: "200px",
  background: "linear-gradient(to left, orange, transparent)",
  flexShrink: 0,
  // NOTE: what we are trying to emulate:
  //position: "sticky",
  right: 20,
}

const FrozenColumnRight = ({ style }) => (
  <div id="right" style={{ ...frozenColumnStyleRight, ...style }} />
)

const frozenFooterStyle = {
  height: "80px",
  width: "540px",
  background: "linear-gradient(to top right, red, transparent)",
  flexShrink: 0,
  // NOTE: what we are trying to emulate:
  //position: "sticky",
  bottom: 20,
}

const FrozenFooter = ({ style }) => (
  <div id="right" style={{ ...frozenFooterStyle, ...style }} />
)

const contentStyle = {
  height: "600px",
  width: "1000px",
  background: "linear-gradient(to bottom right, black, white)",
  flexShrink: 0,
}

const Content = () => (
  <div id="content" style={contentStyle} />
)

const appStyle = {
  width: "600px",
  height: "300px",
  overflow: "auto",
  margin: "40px",
  backgroundColor: "green",
}

class App extends React.Component {
  render() {
    return (
      <div style={{ width: 2000, height: 4000, display: "flex" }}>
        <div style={{ display: "inline-block"}}>
          <div className="App" style={appStyle} ref="container">
            <div style={{ display: "flex", width: "1400px" }}>
              <StickyLeft container={this.findContainer}>
                <FrozenColumn />
              </StickyLeft>
              <Content />
              <StickyLeft container={this.findContainer}>
                <FrozenColumnRight />
              </StickyLeft>
            </div>
            <StickyLeft container={this.findContainer}>
              <FrozenFooter />
            </StickyLeft>
          </div>
        </div>
        <div style={{ display: "inline-block"}}>
          <div className="App" style={appStyle}>
            <div style={{ display: "flex", width: "1400px" }}>
              <FrozenColumn style={{ position: "sticky" }} />
              <Content />
              <FrozenColumnRight style={{ position: "sticky" }} />
            </div>
            <FrozenFooter style={{ position: "sticky" }} />
          </div>
        </div>
        <div style={{ display: "inline-block"}}>
          <div className="App" style={appStyle} ref="container2">
            <div style={{ display: "flex", width: "1400px" }}>
              <StickyLeft container={this.findContainer2}>
                <FrozenColumn style={{ position: "sticky" }} />
              </StickyLeft>
              <Content />
              <StickyLeft container={this.findContainer2}>
                <FrozenColumnRight style={{ position: "sticky" }} />
              </StickyLeft>
            </div>
            <StickyLeft container={this.findContainer2}>
              <FrozenFooter style={{ position: "sticky" }} />
            </StickyLeft>
          </div>
        </div>
      </div>
    )
  }

  findContainer = () => this.refs.container

  findContainer2 = () => this.refs.container2
}

export default App;
