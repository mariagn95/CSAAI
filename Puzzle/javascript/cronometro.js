var cronometro = {
	inicio : function () {
		min_count = 0;
		seg_count = 0;
		hor_count = 0;
		this.control = setInterval(function () {
			if (seg_count < 59) {
				seg_count++;
				if (seg_count < 10) {
					var segundos = "0" + seg_count;
				} else {
					var segundos = seg_count;
				}
				document.getElementById("Segundos").innerHTML = segundos;
			}
			if (seg_count == 59) {
				seg_count = -1;
			}
			if (seg_count == 0) {
				min_count++;
				if (min_count < 10) {
					var minutos = "0" + min_count
				} else {
					var minutos = min_count;
				}
				document.getElementById("Minutos").innerHTML = minutos + ":";
			}
			if (min_count == 59) {
				min_count = -1;
			}
			if ((seg_count == 0)&&(min_count == 0) ) {
				hor_count ++;
				if (hor_count < 10) {
					var horas = "0" + hor_count;
				} else {
					var horas = hor_count;
				}
				document.getElementById("Horas").innerHTML = horas + ":";
			}
		}, 1000);
	},
	parar : function () {
		clearInterval(this.control);
	},
	reinicio : function () {
		document.getElementById("Segundos").innerHTML = "00";
		document.getElementById("Minutos").innerHTML = "00:";
		document.getElementById("Horas").innerHTML = "00:";
	}
}
