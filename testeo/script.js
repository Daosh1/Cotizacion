document.addEventListener('DOMContentLoaded', function () {
	const items = [];

	// Referencias a elementos del DOM
	const clientNameInput = document.getElementById('clientName');
	const clientNameDisplay = document.getElementById('clientNameDisplay');
	const productServiceInput = document.getElementById('productService');
	const quantityInput = document.getElementById('quantity');
	const unitPriceInput = document.getElementById('unitPrice');
	const addItemButton = document.getElementById('addItem');
	const itemsList = document.getElementById('itemsList');
	const subtotalDisplay = document.getElementById('subtotal');
	const totalDisplay = document.getElementById('total');
	const advanceSlider = document.getElementById('advance');
	const advanceValue = document.getElementById('advanceValue');

	// Actualizar nombre del cliente
	clientNameInput.addEventListener('input', function () {
		clientNameDisplay.textContent = this.value || '<NOMBRE VACÍO>';
	});

	// Actualizar valor del anticipo
	advanceSlider.addEventListener('input', function () {
		advanceValue.textContent = this.value + '%';
	});

	// Agregar item
	addItemButton.addEventListener('click', function () {
		const description = productServiceInput.value;
		const quantity = parseFloat(quantityInput.value);
		const unitPrice = parseFloat(unitPriceInput.value);

		if (description && quantity && unitPrice) {
			const total = quantity * unitPrice;
			const item = {
				id: Date.now(),
				description,
				quantity,
				unitPrice,
				total
			};

			items.push(item);
			renderItems();
			clearInputs();
			updateTotals();
		}
	});

	// Renderizar items
	function renderItems() {
		itemsList.innerHTML = '';
		items.forEach(item => {
			const itemElement = document.createElement('div');
			itemElement.className = 'item';
			itemElement.innerHTML = `
                <div class="item-info">
                    <p>${item.description}</p>
                    <small>Cantidad: ${item.quantity} × $${item.unitPrice.toLocaleString()}</small>
                </div>
                <div class="item-actions">
                    <span>$${item.total.toLocaleString()}</span>
                    <button class="delete-btn" onclick="deleteItem(${item.id})">
                        Eliminar
                    </button>
                </div>
            `;
			itemsList.appendChild(itemElement);
		});
	}

	// Eliminar item
	window.deleteItem = function (id) {
		const index = items.findIndex(item => item.id === id);
		if (index !== -1) {
			items.splice(index, 1);
			renderItems();
			updateTotals();
		}
	}

	// Actualizar totales
	function updateTotals() {
		const subtotal = items.reduce((sum, item) => sum + item.total, 0);
		subtotalDisplay.textContent = `$${subtotal.toLocaleString()}`;
		totalDisplay.textContent = `$${subtotal.toLocaleString()}`;
	}

	// Limpiar inputs
	function clearInputs() {
		productServiceInput.value = '';
		quantityInput.value = '';
		unitPriceInput.value = '';
	}
});