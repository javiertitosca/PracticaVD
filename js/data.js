export function cargaDatos() {

  return fetch("Datos alquileres.json")
    .then(r => r.json())
    .then(data => preprocesarDatos(data));
}

export function preprocesarDatos(data) {

  // Selecciono las columnas que me quiero quedar
  const columnas = [
    'Ciudad', 'Barrio', 'Tipo', 'Habitaciones', 'Baños',
    'Superficie (m2)', 'Planta', 'Ascensor',
    'Terraza', 'Parking', 'Calefacción', 'Aire',
    'Balcón', 'Precio del m2 (€/m2)'
  ];

  let datos = data.map(d => {
    const obj = {};
    columnas.forEach(c => obj[c] = d[c]);
    return obj;
  });

  // Elimino los outliers de cada ciudad
  const ciudades = [...new Set(datos.map(d => d.Ciudad))];

  let resultado = [];

  ciudades.forEach(ciudad => {

    const subset = datos.filter(d => d.Ciudad === ciudad);

    const precios = subset
      .map(d => +d["Precio del m2 (€/m2)"])
      .filter(v => Number.isFinite(v))
      .sort((a, b) => a - b);

    const outliers_inferiores = precios[Math.floor(precios.length * 0.01)];
    const outliers_superiores = precios[Math.floor(precios.length * 0.99)];

    const filtrados = subset.filter(d => {
      const v = +d["Precio del m2 (€/m2)"];
      return Number.isFinite(v) && v >= outliers_inferiores && v <= outliers_superiores;
    });

    resultado = resultado.concat(filtrados);
  });

  return resultado;
}