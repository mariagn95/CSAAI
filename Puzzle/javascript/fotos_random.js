function colocarFotos() {
  var fotos = [
    "imagenes/1.png",
    "imagenes/2.png",
    "imagenes/3.jpg",
    "imagenes/4.jpg",
    "imagenes/5.png",
    "imagenes/6.jpg",
    "imagenes/7.jpg",
    "imagenes/8.jpg",
    "imagenes/9.png",
    "imagenes/10.jpg"
  ];
  var sesion = ["", "", ""];
  for (var i = 1; i < 4; i++) {
    do {
      var img = Math.floor(Math.random() * 10);
    } while (repetida(fotos[img], sesion));
    sesion[i - 1] = fotos[img];
    document.getElementById("i" + i).src = sesion[i - 1];
  }
}

function repetida(elemento, lista) {
  var rep = false;
  for (parte in lista) {
    if (lista[parte] == elemento) {
      rep = true;
    }
  }
  return rep;
}
