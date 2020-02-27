class Model {
  constructor() {
    this.pixels
    
    // fetch(url)
    //   .then(res => res.json())
    //   .then(data => this.pixels = data)
  }
  getPixels(){
    const url = "http://localhost:5000/pixels"
    fetch(url)
      .then(res => res.json())
      .then(data => this.callbackAns(data))
      
  }

  callbackAns(data) {
    this.pixels = data
    this.onPixelsReady(this.pixels)

  }

  changePixelColor(id) {

  }
  bindOnPixelsReady(callback) {
    this.onPixelsReady = callback
  }
}

class View {
  constructor() {
    this.colorPicker = this.getElement('#colorPicker')
    this.pixelCanvas = this.getElement('#pixelCanvas')
    this.root = this.getElement('#root')


  }

  displayCanvas(pixels) {
    var table = this.createElement('table');
    
    var tr = this.createElement('tr');

    for (var i = 0; i < pixels.length; i++) {
      if (pixels[i].column == 0) {
        tr = this.createElement('tr')
      }

      var td = this.createElement('td')
      td.id = pixels[i].id
      td.style.backgroundColor = pixels[i].color

      var span = this.createElement('span')
      span.style.width = "10px"
      span.style.height = "10px"
      td.append(span)

      tr.append(td);

      if (pixels[i].column == 19) {
        table.append(tr)
      }
      this.root.append(table)
    }
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

    this.model.bindOnPixelsReady(this.onCanvasChanged.bind(this))
    this.model.getPixels()

  }

  onCanvasChanged = pixels => {
    console.log("ya tut")
    console.log(pixels)
    this.view.displayCanvas(pixels)
  }


}


function init() {
  const app = new Controller(new View(), new Model())
}

window.onload = init
