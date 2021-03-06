class Model {
  constructor() {
    this.url = "https://pixel-art-back.herokuapp.com/"
    this.socket = io.connect(this.url)
  }

  _commit() {
    this.getPixels()
  }

  getPixels(callback1, callback2) {
    callback1()
    this.socket.on('pixels', (data) => {
      callback2()
      this.onPixelsReady(data)
    })
  }

  changePixelColor(id, color) {
    var data = {
      'id': id,
      'color': color
    }
    this.socket.emit('change color', data)

  }

  pixelModelColorChange(callback) {
    this.socket.on('color changed', (data) => {
      callback(data)
    })
  }

  getUserNumber(callback) {
    this.socket.on('user count', (data) => {
      callback(data)
    })
  }

  bindOnPixelsReady(callback) {
    this.onPixelsReady = callback
  }
}

class View {
  constructor() {
    this.colorPicker = this.getElement('#colorPicker')
    this.info = this.getElement('.info-wrapper')
    this.main = this.getElement('.main')

    this.container = this.getElement('#container')
    this.content = this.getElement('#content')
    this.context = this.content.getContext('2d')
    this.spinner = this.getElement('#spinner')

    this.infoClosed = false

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
    setTimeout(() => {
      this.spinner.className = this.spinner.className.replace("show", "");
    }, 5000);
  }

  hideSpinner() {
    this.spinner.className = this.spinner.className.replace("show", "");
  }

  toggleInfo() {
    if (this.infoClosed) {
      this.info.classList.remove('disabled')
      this.main.classList.add('disabled')
    } else {
      this.info.classList.add('disabled')
      this.main.classList.remove('disabled')
    }
    this.infoClosed = !this.infoClosed
  }

  infoListener() {
    var close = document.getElementById("close")
    close.addEventListener("click", () => {
      this.toggleInfo()
    })
    var open = document.getElementById("open")
    open.addEventListener("click", () => {
      this.toggleInfo()
    })
  }

  initScroller(pixels) {
    var rows = pixels.maxRow
    var cols = pixels.maxCol

    this.contentHeight = this.cellHeight * rows
    this.contentWidth = this.cellWidth * cols

    delete pixels.maxRow
    delete pixels.maxCol

    this.scroller = new Scroller(this.canvasRender.bind(this), {
      zooming: true,
      locking: false
    }, pixels)

    var rect = this.container.getBoundingClientRect();
    this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);

  }

  initColor() {
    this.color = "222222"
    var color4 = document.getElementById("4")
    this.makeCurrColor(color4)

  }

  colorListeners() {
    var color1 = document.getElementById("1")
    color1.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color1)
      this.color = "FFFFFF"
    })

    var color2 = document.getElementById("2")
    color2.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color2)
      this.color = "E4E4E4"
    })

    var color3 = document.getElementById("3")
    color3.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color3)
      this.color = "888888"
    })

    var color4 = document.getElementById("4")
    color4.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color4)
      this.color = "222222"
    })

    var color5 = document.getElementById("5")
    color5.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color5)
      this.color = "FFA7D1"
    })

    var color6 = document.getElementById("6")
    color6.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color6)
      this.color = "E50000"
    })

    var color7 = document.getElementById("7")
    color7.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color7)
      this.color = "E59500"
    })

    var color8 = document.getElementById("8")
    color8.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color8)
      this.color = "A06A42"
    })

    var color9 = document.getElementById("9")
    color9.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color9)
      this.color = "E5D900"
    })

    var color10 = document.getElementById("10")
    color10.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color10)
      this.color = "94E044"
    })

    var color11 = document.getElementById("11")
    color11.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color11)
      this.color = "02BE01"
    })

    var color12 = document.getElementById("12")
    color12.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color12)
      this.color = "00D3DD"
    })

    var color13 = document.getElementById("13")
    color13.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color13)
      this.color = "0083C7"
    })

    var color14 = document.getElementById("14")
    color14.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color14)
      this.color = "0000EA"
    })

    var color15 = document.getElementById("15")
    color15.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color15)
      this.color = "CF6EE4"
    })

    var color16 = document.getElementById("16")
    color16.addEventListener("click", () => {
      this.cleanPrevColor()
      this.makeCurrColor(color16)
      this.color = "820080"
    })
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

    if ('ontouchstart' in window) {

      this.content.addEventListener("touchstart", function(e) {
        // Don't react if initial down happens on a form element
        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
          return;
        }

        self.scroller.doTouchStart(e.touches, e.timeStamp);
        e.preventDefault()
      }, false);

      document.addEventListener("touchmove", function(e) {

        self.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      }, false)

      document.addEventListener("touchend", function(e) {
        self.scroller.doTouchEnd(e.timeStamp);
      }, false)

      document.addEventListener("touchcancel", function(e) {
        self.scroller.doTouchEnd(e.timeStamp);
      }, false)

    } else {
      document.addEventListener("keydown", function(e) {

        var keyCode = e.keyCode

        switch(keyCode) {
          case 69:
          case 187:
            //Zoom In
            self.scroller.zoomBy(1.2, true)
            break
          case 81:
          case 189:
            // Zoom out
            self.scroller.zoomBy(0.8, true)
            break
          case 65:
          case 37:
            //Left
            self.scroller.scrollBy(-150, 0, true)
            break

          case 68:
          case 39:
            //RIght
            self.scroller.scrollBy(150, 0, true)
            break
        
          case 87:
          case 38:
            //Up
            self.scroller.scrollBy(0, -150, true)
            break

          case 83:
          case 40:
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
    
          //Change color HERE
          const index = row + "_" + col

          self.colorCallback(index, self.color)

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
        const index = row + "_" + col
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

  showUserCount(userNum) {
    var text = this.getElement('#usersNumText')
    text.textContent = userNum
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
    
    this.view.infoListener()

    this.view.initColor()
    this.view.colorListeners()
    //Display Canvas
    this.model.bindOnPixelsReady(this.onCanvasChangedHandler.bind(this))
    this.view.bindColorChange(this.colorChangeCallback.bind(this))
    this.model.getPixels(this.loadingStartHandler.bind(this), this.loadingEndHandler.bind(this))

    this.model.pixelModelColorChange(this.colorViewChangeHandler.bind(this))

    //Display User Number
    this.model.getUserNumber(this.userCountHandler.bind(this))

  }

  tableReadyHandler() {
    this.view.listeners()
  }

  colorChangeCallback(id, color) {
    this.model.changePixelColor(id, color)
  }

  onCanvasChangedHandler(pixels) {
    //Canvas Zoom Pan
    this.view.initScroller(pixels)
    this.view.reflow()
    this.view.listeners()
  }

  colorChangedHandler(id, color) {
    this.model.changePixelColor(id, color)
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
