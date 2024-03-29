let gastos = localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : [];

function guardarGastos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

function agregarGasto() {
  const montoInput = document.getElementById('monto');
  const monto = parseFloat(montoInput.value);

  if (!isNaN(monto) && monto > 0) {
    const nuevoGasto = {
      id: gastos.length + 1,
      concepto: "Nuevo Gasto",
      monto: monto,
      fecha: obtenerFechaActual()
    };

    gastos.push(nuevoGasto);
    mostrarGastos();
    actualizarTotal();
    guardarGastos();

    montoInput.value = '';
  } else {
    Swal.fire("Ingrese un monto válido mayor que cero");
  }
}

function obtenerFechaActual() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

function mostrarGastos() {
  const listaGastos = document.getElementById('listaGastos');
  listaGastos.innerHTML = '';

  if (gastos.some(gasto => gasto.fecha === undefined)) {
    gastos.forEach((gasto, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${gasto.concepto}: $${gasto.monto.toFixed(2)}`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.onclick = function() {
        eliminarGasto(index);
      };

      listItem.appendChild(deleteButton);
      listaGastos.appendChild(listItem);
    });
  } else {

    gastos.forEach((gasto, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${gasto.concepto}: $${gasto.monto.toFixed(2)} (${gasto.fecha})`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.onclick = function() {
        eliminarGasto(index);
      };

      listItem.appendChild(deleteButton);
      listaGastos.appendChild(listItem);
    });
  }
}

function eliminarGasto(index) {
  gastos.splice(index, 1);
  mostrarGastos();
  actualizarTotal();
  guardarGastos();
}

function actualizarTotal() {
  const totalElement = document.getElementById('total');
  const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  totalElement.textContent = total.toFixed(2);
}

function borrarGastos() {
  gastos = [];
  mostrarGastos();
  actualizarTotal();
  guardarGastos();
}

function cargarGastosFijos() {
  fetch('./gastos.json')
    .then(response => response.json())
    .then(data => {
      gastos = data;
      mostrarGastos();
      actualizarTotal();
    })
    .catch(error => Swal.fire("No se cargaron correctamente los datos"));
}

function guardarListaYCrearNueva() {
  guardarGastos();
  gastos = [];
  mostrarGastos();
  actualizarTotal();
}

window.onload = function() {
  cargarGastosFijos();
};

function verHistorial() {
  console.log("Mostrando historial de gastos");

  Swal.fire({
    title: 'Historial de Gastos',
    html: construirHistorial(),
    showCloseButton: true,
    showCancelButton: false,
    showConfirmButton: false
  });
}

function construirHistorial() {
  let historialHTML = '<ul>';
  gastos.forEach((gasto) => {
    historialHTML += `<li>${gasto.concepto}: $${gasto.monto.toFixed(2)} (${gasto.fecha})</li>`;
  });
  historialHTML += '</ul>';
  return historialHTML;
}