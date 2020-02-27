class Model {
  constructor() {
    this.pixels
    this.url = "http://localhost:5000/pixels"
    this.socket = io.connect(this.url)


    // fetch(url)
    //   .then(res => res.json())
    //   .then(data => this.pixels = data)
  }

  _commit() {
    this.getPixels()
  }

  getPixels() {
    this.socket.on('pixels', (data) => {
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

    // var json_data = {
    //   color: color
    // }

    // var data = {"color" : color}
    // var xmlhttp = new XMLHttpRequest()
    // xmlhttp.open("PUT", this.url + '/' + id, true)
    // xmlhttp.send( JSON.stringify( data ) )

    
    // fetch(this.url + '/' + id + '/' + color)
    //   .then(res => this._commit())

    this.socket.emit('change color', {id: id, color: color})
    // this._commit

    // $.ajax({  
    //   url: this.url + '/' + id,
    //   type: 'PUT',  
    //   dataType: 'json',  
    //   data: data,
    //   success: function (data, textStatus, xhr) {  
    //       console.log(data);  

    //   },  
    //   error: function (xhr, textStatus, errorThrown) {  
    //       console.log('Error in Operation');  

    //   }  
    // });  

    // var xmlHttp = createCORSRequest('PUT', this.url + '/' + id + '/');
    // var xmlHttp = new XMLHttpRequest()

    // var mimeType = "application/json"
    // xmlHttp.open('POST', this.url + '/' + id + '/', true)
    // xmlHttp.setRequestHeader('Content-Type', mimeType)
    // xmlHttp.send(data)


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
      span.style.width = "10px"
      span.style.height = "10px"
      td.append(span)

      tr.append(td);

      if (pixels[i].column == 19) {
        this.table.append(tr)
      }
      this.root.innerHTML = ''
      this.root.append(this.table)
    }

    this.onTableReady();

  }

  // cellClick(event) {
  //   console.log(event.currentTarget.id)
  // }

  // bindChangePixelColor(handler) {

  // }

  bindHandlers(handler) {
    var cells = document.querySelectorAll("td");
    // console.log(this.table)

    cells.forEach(cell => cell.addEventListener('click', event => {
      // console.log(event.currentTarget.id)

      handler(event.currentTarget.id, this.colorPicker.value)

    }))   
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

    this.view.bindOnTableReady(this.tableReadyHandler.bind(this))
    // this.view.bindChangePixelColor(this.handleChangePixelColor)

  }

  tableReadyHandler() {
    this.view.bindHandlers(this.colorChangedHandler)
  }

  onCanvasChanged = pixels => {
    this.view.displayCanvas(pixels)
  }

  colorChangedHandler = (id, color) => {
    this.model.changePixelColor(id, color)
  }


}


function init() {
  
  const app = new Controller(new View(), new Model())
}

window.onload = init
