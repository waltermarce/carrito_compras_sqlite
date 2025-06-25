from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # permite llamadas cross‐origin desde el frontend

def init_db():
    """Crea la base y la tabla pedidos si no existen."""
    with sqlite3.connect("database.db") as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto TEXT,
            cantidad INTEGER,
            precio REAL,
            fecha TEXT
        )
        ''')

@app.route("/guardar", methods=["POST"])
def guardar():
    """Recibe JSON con { carrito: [...], fecha: '...' } e inserta en SQLite."""
    data = request.json
    with sqlite3.connect("database.db") as conn:
        for item in data["carrito"]:
            conn.execute(
                "INSERT INTO pedidos (producto, cantidad, precio, fecha) VALUES (?, ?, ?, ?)",
                (item["nombre"], item["cantidad"], item["precio"], data["fecha"])
            )
    return jsonify({"status": "ok", "mensaje": "Pedido guardado correctamente"})

@app.route("/pedidos", methods=["GET"])
def obtener_pedidos():
    """Devuelve en JSON la lista de pedidos ordenada del más reciente al más antiguo."""
    with sqlite3.connect("database.db") as conn:
        cursor = conn.execute(
            "SELECT producto, cantidad, precio, fecha FROM pedidos ORDER BY id DESC"
        )
        pedidos = [
            {"producto": row[0], "cantidad": row[1], "precio": row[2], "fecha": row[3]}
            for row in cursor.fetchall()
        ]
    return jsonify(pedidos)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)  # servidor en http://127.0.0.1:5000
