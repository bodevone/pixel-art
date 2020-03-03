class Model {
  constructor() {
    this.pixels
    // this.url = "https://pixel-art-back.herokuapp.com/pixels"
    // this.url = "http://localhost:4000"
    this.url = "https://pixel-node-back.herokuapp.com/"
    this.socket = io.connect(this.url)

  }

  _commit() {
    this.getPixels()
  }

  getPixels() {
    this.socket.on('pixels', (data) => {
      console.log(data)
      this.pixels = data
      this.onPixelsReady(this.pixels)
    })

    // fetch(this.url)
    //   .then(res => res.json())
    //   .then(data => this.callbackAns(data))
      
  }

  changePixelColor(id, color) {
    console.log(id)
    console.log(color)
    color = color.substr(1)

    this.socket.emit('change color', {id: id, color: color})

    // this._commit

  }

  pixelModelColorChange(callback) {
    // this.colorChange()
    this.socket.on('color changed', (data) => {
      callback(data[0].id, data[0].color)
    })
    // this.onPixelColorChangeReady = callback
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
    // this.pixelCanvas = this.getElement('#pixelCanvas')
    this.canvas = this.getElement('#canvas')
    this.table
  }

  bindOnTableReady(callback){
    this.onTableReady = callback
  }

  displayCanvas(pixels) {

    this.table = this.createElement('table');
    var tr = this.createElement('tr');

    for (var i = 0; i < pixels.length; i++) {
      if (pixels[i].column == 0) {
        tr = this.createElement('tr')
      }

      var td = this.createElement('td')
      td.id = pixels[i].id
      td.style.backgroundColor = pixels[i].color

      var span = this.createElement('span')
      span.style.width = '10px'
      span.style.height = '10px'
      td.append(span)

      tr.append(td);

      if (pixels[i].column == 19) {
        this.table.append(tr)
      }
      this.canvas.innerHTML = ''
      this.canvas.append(this.table)
    }

    this.onTableReady();

  }

  pixelColorChange(id, color) {
    var pixel = document.getElementById(id)
    pixel.style.backgroundColor = color
  }

  // bindChangePixelColor(handler) {

  // }

  bindHandlers(handler) {
    var cells = document.querySelectorAll('td');
    // console.log(this.table)

    cells.forEach(cell => cell.addEventListener('click', event => {
      // console.log(event.currentTarget.id)

      handler(event.currentTarget.id, this.colorPicker.value)

    }))   
  }

  showUserCount(userNum) {
    var text = this.getElement('#userCount')
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


    //Display Canvas
    this.model.bindOnPixelsReady(this.onCanvasChangedHandler.bind(this))
    this.model.getPixels()

    this.view.bindOnTableReady(this.tableReadyHandler.bind(this))
    // this.view.bindChangePixelColor(this.handleChangePixelColor)

    //Display User Number
    this.model.getUserNumber(this.userCountHandler)

  }

  tableReadyHandler() {
    this.view.bindHandlers(this.colorChangedHandler)
    this.model.pixelModelColorChange(this.colorViewChangeHandler)
  }

  onCanvasChangedHandler = (pixels) => {
    this.view.displayCanvas(pixels)
  }

  colorChangedHandler = (id, color) => {
    this.model.changePixelColor(id, color)
  }

  colorViewChangeHandler = (id, color) => {
    this.view.pixelColorChange(id, color)
  }

  userCountHandler = (num) => {
    this.view.showUserCount(num)
  }


}


function init() {  
  const app = new Controller(new View(), new Model())
}

window.onload = init
