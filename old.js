// Select color input
const colorPicker = $('#colorPicker');

//Select form
// const sizePicker = $('#sizePicker');

// Select size input
// const inputHeight = $('#inputHeight');
// const inputWidth = $('#inputWidth');

//Select pixelCanvas
const pixelCanvas = $('#pixelCanvas');

// makeGrid(20, 20);

// // When size is submitted by the user, call makeGrid()
// sizePicker.submit(function(event) {
//   // Draw drid based on input values
//   makeGrid(, inputHeight.val());
//   // prevent page refresh on submit
//   event.preventDefault();
// });

// When a canvas cell is left-clicked fill the corresponding colorPicker color in it, if right clicked then unfill the color
// var marker = false;

pixelCanvas.on('mousedown','td',function (e){
   if (e.which == 1) {
     $(this).css('background-color',colorPicker.val());

     // if (!marker) {
     //   marker = true;
     // } else {
     //  marker = false;
     // }
    // this is left click event.
     // console.log(this)
    }
    if (e.which == 2) {
    // this is middle click event.
    }
    if (e.which == 3) {
    // this is right click event.
    $(this).css('background-color',"#FFFFFF");
    }
});

pixelCanvas.on("contextmenu","td",function(){
           // alert('right click disabled');
         return false;
      });

var url = "http://localhost:5000/pixels";

fetch(url)
  .then(res => res.json())
  .then(data => createCanvas(data))

function createCanvas(data) {
  console.log(data)

  // pixelCanvas.children().remove();
  //
  // const tr_html = '<tr></tr>';
  // const td_html = '<td style="background-color:' + data[0].color + ';"><span style="width:10px;height:10px;"></span></td>';
  // let tr = $(tr_html);
  // let td = $(td_html);
  // for (let rows = 0; rows < 20; rows++) {
  //   tr.remove();
  //   for (let cols = 0; cols < 20; cols++) {
  //     tr.append(td_html);
  //   }
  //   pixelCanvas.append(tr);
  //   tr = $(tr_html);
  // }

  pixelCanvas.children().remove();

  const tr_html = '<tr></tr>';
  let tr = $(tr_html);

  for (let i = 0; i < data.length; i++) {
    if (data[i].column == 0) {
      tr.remove();
    }

    const td_html = '<td style="background-color:' + data[i].color + '; id="' + data[i].id.toString() + ';"><span style="width:10px;height:10px;"></span></td>';
    let td = document.createElement('td')
    td.id = i.toString()
    // let td = $(td_html);

    tr.append(td_html);

    if (data[i].column == 19) {
      pixelCanvas.append(tr);
      tr = $(tr_html);
    }

    console.log(data[i].color)
  }
}

//ID: 1 - 400
//ROW: 0 - 19
//COLUMN: 0 - 19

for (let i = 1; i<=400; i++) {
  document.getElementById(" " + i.toString()).addEventListener("click", function(){
    console.log(this);
  });
}

function makeGrid(w,h) {
  pixelCanvas.children().remove();
  const tr_html = '<tr></tr>';
  const td_html = '<td style="background-color:#FFFFFF;"><span style="width:10px;height:10px;"></span></td>';
  let tr = $(tr_html);
  let td = $(td_html);
  for (let rows = 0; rows < w; rows++) {
    tr.remove();
    for (let cols = 0; cols < h; cols++) {
      tr.append(td_html);
    }
    pixelCanvas.append(tr);
    tr = $(tr_html);
  }
}
