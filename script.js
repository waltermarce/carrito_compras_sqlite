const productos = [
  { nombre: "Gaseosa", precio: 700 },
  { nombre: "Papas", precio: 400 },
  { nombre: "Sándwich", precio: 1000 }
];

let carrito = [];

function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  productos.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button id="btn-${index}" onclick="agregarAlCarrito(${index})">Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(index) {
  if (carrito.find(item => item.nombre === productos[index].nombre)) return;
  carrito.push({ ...productos[index], cantidad: 1 });
  const btn = document.getElementById(`btn-${index}`);
  btn.disabled = true;
  btn.textContent = "Agregado";
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("carrito-lista");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    lista.innerHTML += `<li>${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}</li>`;
    total += item.precio * item.cantidad;
  });
  document.getElementById("total").textContent = total;
}

function confirmarCompra() {
  const total = document.getElementById("total").textContent;
  alert("Compra confirmada por $" + total);
  guardarEnSQLite();
  carrito = [];
  actualizarCarrito();
  location.reload(); // recarga para resetear botones
}

function guardarEnSQLite() {
  const fecha = new Date().toLocaleString();
  fetch("http://localhost:5000/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carrito, fecha })
  })
  .then(res => res.json())
  .then(data => console.log(data.mensaje))
  .catch(err => console.error("Error al guardar:", err));
}

function mostrarPedidosAnteriores() {
  const lista = document.getElementById("pedidos-anteriores");
  lista.innerHTML = "";
  fetch("http://localhost:5000/pedidos")
    .then(res => res.json())
    .then(data => {
      data.forEach(p => {
        lista.innerHTML += `<li>${p.fecha} - ${p.cantidad} x ${p.producto} - $${p.precio}</li>`;
      });
    })
    .catch(err => console.error("Error al obtener pedidos:", err));
}

// Inicialización
mostrarProductos();
mostrarPedidosAnteriores();
