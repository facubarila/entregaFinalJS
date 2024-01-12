// Obtener datos guardados en el almacenamiento local (si existen)
let gastos = localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : [];
// Función para guardar los gastos en el almacenamiento local
function guardarGastos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}
// Función para agregar un nuevo gasto
function agregarGasto() {
  const montoInput = document.getElementById('monto');
  const monto = parseFloat(montoInput.value);

  if (!isNaN(monto) && monto > 0) {
    // Crear un objeto de gasto
    const nuevoGasto = {
      id: gastos.length + 1,
      concepto: "Nuevo Gasto",
      monto: monto,
      fecha: obtenerFechaActual()
    };

    // Agregar el gasto al array
    gastos.push(nuevoGasto);

    // Actualizar la lista de gastos
    mostrarGastos();

    // Actualizar el total acumulado
    actualizarTotal();

    // Guardar los gastos en el almacenamiento local
    guardarGastos();

    // Limpiar el campo de monto
    montoInput.value = '';
  } else {
    Swal.fire("Ingrese un monto válido mayor que cero");
  }
}
// Función para obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}
// Función para actualizar la lista de gastos
function mostrarGastos() {
  const listaGastos = document.getElementById('listaGastos');
  listaGastos.innerHTML = '';

  gastos.forEach((gasto, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${gasto.concepto}: $${gasto.monto.toFixed(2)} (${gasto.fecha})`;

    // Agregar botón para eliminar gasto
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = function() {
      eliminarGasto(index);
    };

    listItem.appendChild(deleteButton);
    listaGastos.appendChild(listItem);
  });
}
// Función para eliminar un gasto
function eliminarGasto(index) {
  gastos.splice(index, 1);
  mostrarGastos();
  actualizarTotal();
  guardarGastos();
}
// Función para actualizar el total acumulado
function actualizarTotal() {
  const totalElement = document.getElementById('total');
  const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  totalElement.textContent = total.toFixed(2);
}
// Función para borrar todos los gastos
function borrarGastos() {
  gastos = [];
  mostrarGastos();
  actualizarTotal();
  guardarGastos();
}
// Función para cargar gastos desde un archivo JSON mediante Fetch
function cargarGastosFijos() {
  fetch('./gastos.json')
    .then(response => response.json())
    .then(data => {
      gastos = data;
      mostrarGastos();
      actualizarTotal();
    })
    .catch(error => Swal.fire("no se cargaron correctamente los datos"));
}

// Al cargar la página, cargar gastos desde el archivo JSON y actualizar la lista de gastos y el total acumulado
window.onload = function() {
  cargarGastosFijos();
};