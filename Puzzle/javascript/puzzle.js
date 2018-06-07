function cargando() {  //funcion para que cargue el programa
  canvas = document.getElementById('tablero');
  canvas.height = canvas.width;
  puzzle.tablero = canvas;
  puzzle.ctx = canvas.getContext("2d");
  puzzle.pw = canvas.width / 3;
  puzzle.ph = canvas.height / 3;
  puzzle.ctx.fillStyle = "white";
  puzzle.ctx.fillRect(0, 0, puzzle.tablero.width, puzzle.tablero.height);
  colocarFotos();
  cronometro.parar();
  cronometro.reinicio();
  $(document).ready(function(){
     $("#container").hide();
     $("#contenedor").hide();
     $("#completa").hide();
     $("#formulario").hide();
     $("#tablaRecord").hide();
   });
}

function cambiarImagenes() {  //volver a cargar cuando estas en el puzzle y quieres otra img
  $(document).ready(function(){
     $("#i1").show();
     $("#i2").show();
     $("#i3").show();
     $("#imagenes").show();
     $("#records").show();
     $("#tablaRecord").hide();
   });
  cargando();
}

function seleccionar(img) {  //Función para elegir la imagen del puzzle
  puzzle.reiniciarTablero();
  puzzle.img = new Image();
  puzzle.img.src = img.src;
  puzzle.img.width = 300;
  puzzle.img.height = 300;
  document.getElementById('completa').src = img.src;
  puzzle.imgw = puzzle.img.width / 3;
  puzzle.imgh = puzzle.img.height / 3;
  puzzle.piezasAleatorias();
  puzzle.dibujarTablero();
  cronometro.inicio();
  $(document).ready(function(){
     $("#container").slideDown(1000);
     $("#contenedor").show();
     $("#i1").hide();
     $("#i2").hide();
     $("#i3").hide();
     $("#records").hide();
     $("#completa").show();
     $("#tablaRecord").hide();
   });
}
// ctx.drawImage(img, imgx, imgy, imgw, imgh, canvasx, canvasy, canvasw, canvash);
var puzzle = { //objeto puzzle
  piezas : [
    [[],[],[]],
    [[],[],[]],
    [[],[],[]]
  ],
  libre : [],
  dibujarPieza : function (tab) { // tab(posicion del tablero) = [x, y] → 0 1 2
    var crdimg = this.piezas[tab[0]][tab[1]];
    var imgx = crdimg[0] * this.imgw;
    var imgy = crdimg[1] * this.imgh;
    var px = tab[0] * this.pw;
    var py = tab[1] * this.ph;
    this.ctx.drawImage(this.img, imgx, imgy, this.imgw, this.imgh, px, py, this.pw, this.ph);
  },
  dibujarTablero : function () {
    var tab = [];
    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        tab = [x, y];
        if (this.cuadranteLibre(tab)) {
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(x * this.pw, y * this.ph, this.pw, this.ph);
        }else {
          this.dibujarPieza(tab);
        }
        tab = [];
      }
    }
    this.drawLines();
  },
  drawLines : function () {
    for (var i = 1; i < 3; i++) {
      this.ctx.moveTo(i * this.pw, 0);
      this.ctx.lineTo(i * this.pw, 3 * this.ph);
      this.ctx.moveTo(0, i * this.ph);
      this.ctx.lineTo(3 * this.pw, i * this.ph);
    }
    this.ctx.stroke();
  },
  mover : function (event) {
    var x = event.offsetX;
    var y = event.offsetY;
    var pieza = [parseInt(x / 100), parseInt(y / 100)];
    if (this.mirarPiezas(pieza)) {
      this.piezas[this.libre[0]][this.libre[1]] = this.piezas[pieza[0]][pieza[1]];
      this.libre = pieza;
    }
    this.dibujarTablero();
    if (this.victoria()) {
      cronometro.parar();
      $(document).ready(function(){
         $("#formulario").show();
         $("#container").hide();
         $("#contenedor").hide();
         $("#completa").hide();
       });
    }
  },
  mirarPiezas : function (pieza) {
    var izquierda = [pieza[0], pieza[1] - 1];
    var derecha = [pieza[0], pieza[1] + 1];
    var abajo = [pieza[0] + 1, pieza[1]];
    var arriba = [pieza[0] - 1, pieza[1]];
    if (arriba != undefined && this.cuadranteLibre(arriba)) {
      return true;
    } else if (abajo != undefined && this.cuadranteLibre(abajo)) {
      return true;
    } else if (derecha != undefined && this.cuadranteLibre(derecha)) {
      return true;
    } else if (izquierda != undefined && this.cuadranteLibre(izquierda)) {
      return true;
    } else {
      return false;
    }
  },
  cuadranteLibre : function (q) {
    return (q[0] == this.libre[0]) && (q[1] == this.libre[1]);
  },
  piezasAleatorias: function () {
    var list = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        do {
          var y = Math.floor(Math.random() * 3);
          var x = Math.floor(Math.random() * 3);
        } while (list[x][y] != undefined);
        list[x][y] = [i, j];
        if (i == 2 && j == 2) {
          this.libre = [x, y];
        }
      }
    }
    this.piezas = list;
  },
  victoria : function () {
    var bien = 0; // piezas en su sitio
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.mismaCasilla([i, j], this.piezas[i][j])) {
          bien++;
        }
      }
    }
    return bien == 9;
  },
  mensajeVictoria : function () {
    var nick = this.cogerNombre();
    var tiempo = this.cogerTiempo();
    this.guardarRecord(nick, tiempo);
    cambiarImagenes();
    cronometro.reinicio();
  },
  cogerNombre : function () {
    return document.getElementById("nick").value;
  },
  cogerTiempo : function () {
    var s = document.getElementById("Segundos").innerHTML;
    var m = document.getElementById("Minutos").innerHTML;
    var h = document.getElementById("Horas").innerHTML;
    return h.toString() + m.toString() + s.toString();
  },
  guardarRecord : function (nick, tiempo) {
    var r = nick + "=" + tiempo;
    if (localStorage.record != undefined) {
      var record = localStorage.record;
      record += "//" + r;
      localStorage["record"] = record;
    } else {
      localStorage["record"] = r;
    }
  },
  mostrarRecords : function () {
    $(document).ready(function(){
      $("#tablaRecord").show();
      $("#contenedor").hide();
      $("#imagenes").hide();
      $("#container").hide();
    });
    if (localStorage.record != undefined) {
      var record = localStorage.record.split("//");
      var tablaRecord = "";
      for (i in record) {
        tablaRecord += record[i] + "<br>";
      }
      document.getElementById("tablaRecord").innerHTML = tablaRecord;
    }
  },
  mismaCasilla : function (c1, c2) {
    return (c1[0] == c2[0]) && (c1[1] == c1[1]);
  },
  reiniciarTablero : function () {
    this.piezas = [
      [[],[],[]],
      [[],[],[]],
      [[],[],[]]
    ];
    this.libre = [];
    cronometro.parar();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.tablero.width, this.tablero.height);
  }
}
