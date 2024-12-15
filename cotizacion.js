addEventListener("DOMContentLoaded", (event) => {
	const dom_nombreCliente = document.getElementById('nombre-cliente')
	const input_nombreCliente = document.getElementById('input-nombre-cliente')

	/* nombre del cliente */
	function dom_dataColor(lleno, dom_selector) {
		if (lleno) {
			dom_selector.removeAttribute('style')
		} else {
			dom_selector.style.backgroundColor = "var(--morado)";
			dom_selector.style.color = "white";
		}
	}

	dom_nombreCliente.textContent = '<NOMBRE VACIO>'
	dom_dataColor(false, dom_nombreCliente)

	input_nombreCliente.onkeyup = (event) => {
		if (input_nombreCliente.value == '') {
			dom_nombreCliente.textContent = '<NOMBRE VACIO>'
			dom_dataColor(false, dom_nombreCliente)
		} else {
			dom_nombreCliente.textContent = input_nombreCliente.value
			dom_dataColor(true, dom_nombreCliente)
		}
	};

	const dom_fechaCotizacion = document.getElementById('fecha-cotizacion')
	const date = new Date();

	const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
	const text = date.getDate() + ' de ' + month[date.getMonth()] + ' de ' + date.getFullYear()
	dom_fechaCotizacion.textContent = text

	document.getElementsByTagName
	/*
	porcentajes de forma de pago posiblemente con valor on change para un input range
	*/
	const input = document.getElementById("range")
	input.oninput = (event) => {
		console.log(input.value)
	}
});
