document.addEventListener("DOMContentLoaded", (event) => {
	const dom_nombreCliente = document.getElementById("nombre-cliente")
	const input_nombreCliente = document.getElementById("input-nombre-cliente")
	const itemDescTable = document.getElementById("item-desc")
	const totalDescuTable = document.getElementById("total-descu")
	const listadoProductos = document.getElementById("listadoProductos-servicios")
	const anticipoSlider = document.getElementById("a")
	const anticipoDisplay = document.getElementById("anticipo")
	const cancelarDisplay = document.getElementById("cancelar")
	const mesesGarantia = document.getElementById("meses-garantia")

	function dom_dataColor(lleno, dom_selector) {
		if (lleno) {
			dom_selector.removeAttribute("style")
		} else {
			dom_selector.style.backgroundColor = "var(--morado)"
			dom_selector.style.color = "white"
		}
	}

	dom_nombreCliente.textContent = "<NOMBRE VACIO>"
	dom_dataColor(false, dom_nombreCliente)

	input_nombreCliente.onkeyup = (event) => {
		if (input_nombreCliente.value == "") {
			dom_nombreCliente.textContent = "<NOMBRE VACIO>"
			dom_dataColor(false, dom_nombreCliente)
		} else {
			dom_nombreCliente.textContent = input_nombreCliente.value
			dom_dataColor(true, dom_nombreCliente)
		}
	}

	const dom_fechaCotizacion = document.getElementById("fecha-cotizacion")
	const date = new Date()

	const month = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	]
	const text = date.getDate() + " de " + month[date.getMonth()] + " de " + date.getFullYear()
	dom_fechaCotizacion.textContent = text.toUpperCase()

	anticipoDisplay.textContent = anticipoSlider.value
	cancelarDisplay.textContent = 100 - anticipoSlider.value

	anticipoSlider.oninput = (event) => {
		anticipoDisplay.textContent = anticipoSlider.value
		cancelarDisplay.textContent = 100 - anticipoSlider.value
		actualizarCotizacion()
	}

	function actualizarCotizacion() {
		let subtotal = 0
		itemDescTable.innerHTML = ""

		const items = listadoProductos.querySelectorAll('div[id^="item-"]')
		if (items.length === 0) {
			const row = itemDescTable.insertRow()
			row.className = "linea"
			row.innerHTML = '<td colspan="2" class="item-desc__text">Contenido vacío</td>'
		} else {
			items.forEach((item) => {
				const descripcion = item.querySelector('input[name="productos-servicios"]').value
				const cantidad = Number.parseFloat(item.querySelector('input[name="cantidad"]').value) || 0
				const valorUnitario = Number.parseFloat(item.querySelector('input[name="valor-unitario"]').value) || 0
				const total = cantidad * valorUnitario

				if (descripcion && cantidad && valorUnitario) {
					const row = itemDescTable.insertRow()
					row.className = "linea"
					row.innerHTML = `
                        <td class="item-desc__text">${descripcion}</td>
                        <td class="item-desc__price">$ ${total.toLocaleString()}</td>
                    `
					subtotal += total
				}
			})
		}

		const descuento =
			Number.parseFloat(
				document
					.querySelector("#total-descu .linea:nth-child(2) .total-desc__price")
					.textContent.replace(/[^0-9.-]+/g, ""),
			) || 0
		const total = subtotal - descuento

		totalDescuTable.rows[0].cells[1].textContent = `$${subtotal.toLocaleString()}`
		totalDescuTable.rows[2].cells[1].textContent = `$${total.toLocaleString()}`

		const anticipoPorcentaje = Number.parseInt(anticipoSlider.value)
		const anticipo = total * (anticipoPorcentaje / 100)
		const cancelar = total - anticipo

		document.querySelector(".inicioPago span").textContent = `$${anticipo.toLocaleString()}`
		document.querySelector(".inicioPago + li span").textContent = `$${cancelar.toLocaleString()}`
	}

	listadoProductos.addEventListener("input", actualizarCotizacion)
	actualizarCotizacion()

	function handleEnterKey(event) {
		if (event.key === "Enter") {
			const currentItem = event.target.closest('div[id^="item-"]')
			const inputs = currentItem.querySelectorAll("input")
			const lastInput = inputs[inputs.length - 1]

			if (event.target === lastInput) {
				event.preventDefault()
				addTemplate()
				const newItem = listadoProductos.lastElementChild
				const firstInput = newItem.querySelector("input")
				firstInput.focus()
			} else {
				const nextInput = event.target.nextElementSibling
				if (nextInput && nextInput.tagName === "INPUT") {
					nextInput.focus()
				}
			}
		}
	}

	listadoProductos.addEventListener("keydown", handleEnterKey)

	const inputDescuento = document.getElementById("input-descuento")
	inputDescuento.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			agregarDescuento()
		}
	})

	const inputFormaPago = document.getElementById("input-forma-pago")
	inputFormaPago.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			agregarFormaPago()
		}
	})

	mesesGarantia.addEventListener("change", actualizarGarantia)
})

function addTemplate() {
	const dom_template = document.getElementById("template-desc-el")
	const dom_lps = document.getElementById("listadoProductos-servicios")

	const cant_prod_serv = dom_lps.getElementsByTagName("div").length + 1

	const clon = dom_template.content.cloneNode(true)
	const nuevoItem = document.createElement("div")
	nuevoItem.id = "item-" + cant_prod_serv
	nuevoItem.innerHTML = `<p>${cant_prod_serv}</p>`
	nuevoItem.appendChild(clon)

	const deleteButton = document.createElement("button")
	deleteButton.textContent = "Eliminar"
	deleteButton.className = "btn-delete"
	deleteButton.onclick = () => {
		dom_lps.removeChild(nuevoItem)
		actualizarCotizacion()
		renumerarItems()
	}
	nuevoItem.appendChild(deleteButton)

	dom_lps.appendChild(nuevoItem)

	const lastItem = dom_lps.lastElementChild
	const inputs = lastItem.querySelectorAll("input")
	inputs.forEach((input) => (input.value = ""))

	actualizarCotizacion()
}

function renumerarItems() {
	const items = document.querySelectorAll("#listadoProductos-servicios > div")
	items.forEach((item, index) => {
		item.id = `item-${index + 1}`
		item.querySelector("p").textContent = index + 1
	})
}

function agregarDescuento() {
	const descuento = Number.parseFloat(document.getElementById("input-descuento").value) || 0
	const descuentoCell = document.querySelector("#total-descu .linea:nth-child(2) .total-desc__price")
	descuentoCell.textContent = `$${descuento.toLocaleString()}`

	const subtotal =
		Number.parseFloat(
			document
				.querySelector("#total-descu .linea:nth-child(1) .total-desc__price")
				.textContent.replace(/[^0-9.-]+/g, ""),
		) || 0
	const total = subtotal - descuento
	document.querySelector("#total-descu .linea:nth-child(3) .total-desc__price").textContent =
		`$${total.toLocaleString()}`

	document.getElementById("input-descuento").value = ""

	actualizarCotizacion()
}

function agregarFormaPago() {
	const formaPago = document.getElementById("input-forma-pago").value
	if (formaPago.trim() !== "") {
		const formaPagoList = document.querySelector("#formaDePago ul")
		const newItem = document.createElement("li")
		newItem.className = "forma-pago-adicional"
		newItem.textContent = formaPago
		formaPagoList.appendChild(newItem)
		document.getElementById("input-forma-pago").value = ""
	}
}

function actualizarGarantia() {
	const meses = document.getElementById("meses-garantia").value
	const garantiaText = document.querySelector("#formaDePago ul li:last-child")
	if (meses === "0") {
		garantiaText.textContent = "No se brinda garantía para esta instalación."
	} else {
		garantiaText.textContent = `Se brinda garantía de la instalación por ${meses} ${meses === "1" ? "mes" : "meses"}, no se responde por cambios hechos por el cliente o una tercera persona.`
	}
}

function deshacerDescuento() {
	document.querySelector("#total-descu .linea:nth-child(2) .total-desc__price").textContent = "$0"
	document.getElementById("input-descuento").value = ""
	actualizarCotizacion()
}

