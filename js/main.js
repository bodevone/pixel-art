class Model {
  constructor() {
    this.url = "wss://pixel-art-websocket-server.vercel.app"
    this.ws = new WebSocket(this.url)
    this.userId
    this.name
  }
  _commit() {
    this.getPixels()
  }

  wsConnect(cbStartLoad, cbEndLoad, cbColorChange, cbUserChange) {
    cbStartLoad()
    this.ws.onopen = () => {
      var data = JSON.stringify({"action": "connect"})
      this.ws.send(data)
    }
    this.ws.onmessage = (e) => {
      var data = JSON.parse(e.data)
      switch(data.action) {
        case "connect":
          cbEndLoad()
          cbUserChange(data.userCount)
          this.onPixelsReady(data.canvas)
          break
        case "disconnect":
          cbUserChange(data.userCount)
          break
        case "join":
          cbUserChange(data.userCount)
          break
        case "changeColor":
          cbColorChange(data)
      }
    }
    this.ws.onclose = () => {
      var data = JSON.stringify({
        "action": "disconnect",
      })
      this.ws.send(data)
    }
  }

  changePixelColor(posX, posY, color) {
    var data = JSON.stringify({
      "action": "changeColor",
      "posX": posX,
      "posY": posY,
      "color": color
    })
    this.ws.send(data)
  }

  bindOnPixelsReady(callback) {
    this.onPixelsReady = callback
  }
}

class View {
  constructor() {
    this.defaultColor = "222222"
    this.defaultColorId = "4"
    this.colors = [
      "FFFFFF", "E4E4E4", "888888", "222222",
      "FFA7D1", "E50000", "E59500", "A06A42",
      "E5D900", "94E044", "02BE01", "00D3DD",
      "0083C7", "0000EA", "CF6EE4", "820080"
    ]

    this.colorPicker = this.getElement("#colorPicker")
    this.main = this.getElement(".main")

    this.container = this.getElement("#container")
    this.content = this.getElement("#content")
    this.context = this.content.getContext("2d")
    this.spinner = this.getElement("#spinner")
    this.users = this.getElement(".users")

    this.colorCallback

    this.cellWidth = 100
    this.cellHeight = 100
    this.contentWidth
    this.contentHeight
    this.clientWidth
    this.clientHeight
    this.scroller
    this.zoom
    this.tileWidth
    this.tileHeight

    this.left
    this.top
    this.rows
    this.col

    this.color
    this.prevColorElement
  }

  bindOnTableReady(callback){
    this.onTableReady = callback
  }

  bindColorChange(callback) {
    this.colorCallback = callback
  }

  showSpinner() {
    this.spinner.className = "show";
  }

  hideSpinner() {
    this.spinner.className = this.spinner.className.replace("show", "")
  }

  initScroller(canvas) {
    var rows = canvas.maxX
    var cols = canvas.maxY

    this.contentHeight = this.cellHeight * rows
    this.contentWidth = this.cellWidth * cols

    delete canvas.dimensionX
    delete canvas.dimensionY

    this.scroller = new Scroller(this.canvasRender.bind(this), {
      zooming: true,
      locking: false
    }, canvas)

    var rect = this.container.getBoundingClientRect()
    this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop)
  }

  initColor() {
    this.color = this.defaultColor
    const colorElem = document.getElementById(this.defaultColorId)
    this.makeCurrColor(colorElem)
  }

  colorListeners() {
    for (let i=1; i<=this.colors.length; i++) {
      (() => {
        const colorElem = document.getElementById(i)
        colorElem.addEventListener("click", () => {
          this.cleanPrevColor()
          this.makeCurrColor(colorElem)
          this.color = this.colors[i-1]
        })
      })()
    }
  }

  makeCurrColor(colorElement) {
    colorElement.style.zIndex = "2"
    colorElement.style.outline = "2px solid #fff"
    colorElement.style.boxShadow = "0 0 5px 2px rgba(0, 0, 0, 0.25)"
    
    this.prevColorElement = colorElement
  }

  cleanPrevColor() {
    if (this.prevColorElement) {
      this.prevColorElement.style.zIndex = ""
      this.prevColorElement.style.outline = ""
      this.prevColorElement.style.boxShadow = ""
    }
  }

  reflow() {
    this.clientWidth = this.container.clientWidth
    this.clientHeight = this.container.clientHeight
    this.scroller.setDimensions(this.clientWidth, this.clientHeight, this.contentWidth, this.contentHeight)
  }

  listeners() {
    self = this
    window.addEventListener("resize", this.reflow.bind(this), false);
    if ("ontouchstart" in window) {

      this.content.addEventListener("touchstart", (e) => {
        // Don"t react if initial down happens on a form element
        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
          return
        }
        self.scroller.doTouchStart(e.touches, e.timeStamp)
        e.preventDefault()
      }, false);

      document.addEventListener("touchmove", (e) => {
        self.scroller.doTouchMove(e.touches, e.timeStamp, e.scale)
      }, false)

      document.addEventListener("touchend", (e) => {
        self.scroller.doTouchEnd(e.timeStamp)
      }, false)

      document.addEventListener("touchcancel", (e) => {
        self.scroller.doTouchEnd(e.timeStamp)
      }, false)

    } else {
      document.addEventListener("keydown", function(e) {
        switch(e.key) {
          case "=":
            //Zoom In
            self.scroller.zoomBy(1.2, true)
            break
          case "-":
            // Zoom out
            self.scroller.zoomBy(0.8, true)
            break
          case "ArrowLeft":
          case "a":
            //Left
            self.scroller.scrollBy(-150, 0, true)
            break
          case "ArrowRight":
          case "d":
            //Right
            self.scroller.scrollBy(150, 0, true)
            break
          case "ArrowUp":
          case "w":
            //Up
            self.scroller.scrollBy(0, -150, true)
            break
          case "ArrowDown":
          case "s":
            //Bottom
            self.scroller.scrollBy(0, 150, true)
            break
          }

      }, false)
      
      var mousedown = false;
      var mousemove = false;

      this.container.addEventListener("mousedown", function(e) {

        if (e.target.tagName.match(/input|textarea|select/i)) {
          return;
        }
        
        self.scroller.doTouchStart([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        mousedown = true;
      }, false);

      this.container.addEventListener("mousemove", function(e) {
        self.positionShow(e)

        if (!mousedown) {
          return;
        }

        self.scroller.doTouchMove([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        mousedown = true;
        mousemove = true;
      }, false);

      document.addEventListener("mouseup", function(e) {
        self.positionShow(e)

        if (!mousedown) {
          return;
        }

        if (!mousemove) {
          var x = e.offsetX + self.left
          var y = e.offsetY + self.top

          var col = (x / self.tileWidth) >> 0
          var row = (y / self.tileHeight) >> 0
    
          //Change color
          self.colorCallback(row, col, self.color)

        }

        self.scroller.doTouchEnd(e.timeStamp);

        mousedown = false;
        mousemove = false;
      }, false);

      this.container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
        self.positionShow(e)

        self.scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
      }, false);

    }
  }

  positionShow(e) {
    var x = e.offsetX + self.left
    var y = e.offsetY + self.top

    var col = (x / self.tileWidth) >> 0
    var row = (y / self.tileHeight) >> 0

    var rowSpan = document.getElementById("row")
    var colSpan = document.getElementById("col")

    rowSpan.textContent = row
    colSpan.textContent = col
  }

  canvasRender(left, top, zoom, data) {
    this.zoom = zoom
    this.left = left
    this.top = top

    this.content.width = this.clientWidth
    this.content.height = this.clientHeight

    this.context.clearRect(0, 0, this.clientWidth, this.clientHeight)

    this.tilingRender(data)

  }

  tilingRender(data) {

    // Respect zooming
    this.tileHeight = this.cellHeight * this.zoom;
    this.tileWidth = this.cellWidth * this.zoom;

    // Compute starting rows/columns and support out of range scroll positions
    var startRow = Math.max(Math.floor(this.top / this.tileHeight), 0);
    var startCol = Math.max(Math.floor(this.left / this.tileWidth), 0);

    // Compute maximum rows/columns to render for content size
    var maxRows = (this.contentHeight * this.zoom) / this.tileHeight;
    var maxCols = (this.contentWidth * this.zoom) / this.tileWidth;

    this.rows = maxRows
    this.cols = maxCols
    // Compute initial render offsets
    // 1. Positive scroll position: We match the starting rows/tile first so we
    //    just need to take care that the half-visible tile is fully rendered
    //    and placed partly outside.
    // 2. Negative scroll position: We shift the whole render context
    //    (ignoring the tile dimensions) and effectively reduce the render
    //    dimensions by the scroll amount.
    var startTop = this.top >= 0 ? -this.top % this.tileHeight : -this.top;
    var startLeft = this.left >= 0 ? -this.left % this.tileWidth : -this.left;

    // Compute number of rows to render
    var rows = Math.floor(this.clientHeight / this.tileHeight);

    if ((this.top % this.tileHeight) > 0) {
      rows += 1;
    }

    if ((startTop + (rows * this.tileHeight)) < this.clientHeight) {
      rows += 1;
    }

    // Compute number of columns to render
    var cols = Math.floor(this.clientWidth / this.tileWidth);

    if ((this.left % this.tileWidth) > 0) {
      cols += 1;
    }

    if ((startLeft + (cols * this.tileWidth)) < this.clientWidth) {
      cols += 1;
    }

    // Limit rows/columns to maximum numbers
    rows = Math.min(rows, maxRows - startRow);
    cols = Math.min(cols, maxCols - startCol);


    // Initialize looping variables
    var currentTop = startTop;
    var currentLeft = startLeft;

    // Render new squares
    for (var row = startRow; row < (rows + startRow); row++) {
      for (var col = startCol; col < (cols + startCol); col++) {
        const index = row + ":" + col
        var color = "fff"
        if (data.hasOwnProperty(index)) {
          color = data[index]
        }
        this.paintCell(currentLeft, currentTop, this.tileWidth, this.tileHeight, color)
        currentLeft += this.tileWidth;
      }

      currentLeft = startLeft;
      currentTop += this.tileHeight;
    }

  }

  paintCell(left, top, width, height, color) {
    if (this.zoom >= 0.25) {
      this.context.strokeRect(left, top, width, height);
    } 
    this.context.fillStyle = "#" + color
    this.context.fillRect(left, top, width, height)
		    
  }

  pixelColorChange(data) {
    this.scroller.changeData(data)
  }

  showUserCount(count) {
    this.users.setAttribute("data-count", count)
    this.users.classList.add("notify")

    this.users.classList.remove("notify")
    // el.offsetWidth = el.offsetWidth
    this.users.classList.add("notify")
    this.users.classList.add("show-count")
  }

  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)
    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)
    return element
  }

}

class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    
    this.view.initColor()
    this.view.colorListeners()
    this.model.bindOnPixelsReady(this.onCanvasChangedHandler.bind(this))
    this.view.bindColorChange(this.colorChangeHandler.bind(this))
    this.model.wsConnect(
      this.loadingStartHandler.bind(this),
      this.loadingEndHandler.bind(this),
      this.colorViewChangeHandler.bind(this),
      this.userCountHandler.bind(this)
    )

  }

  tableReadyHandler() {
    this.view.listeners()
  }

  colorChangeHandler(posX, posY, color) {
    this.model.changePixelColor(posX, posY, color)
  }

  onCanvasChangedHandler(pixels) {
    this.view.initScroller(pixels)
    this.view.reflow()
    this.view.listeners()
  }

  colorViewChangeHandler(data) {
    this.view.pixelColorChange(data)
  }

  userCountHandler(num) {
    this.view.showUserCount(num)
  }

  loadingStartHandler() {
    this.view.showSpinner()
  }

  loadingEndHandler() {
    this.view.hideSpinner()
  }

}

function init() {  
  const app = new Controller(new View(), new Model())
}

window.onload = init
