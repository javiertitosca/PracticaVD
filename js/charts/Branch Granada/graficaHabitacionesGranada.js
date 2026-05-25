export function graficaHabitacionesGranada(data) {

  // Defino dimensiones y márgenes de la gráfica
  const width = 850;
  const height = 600;

  const margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
  };

  // Creo el contenedor donde se dibuja la gráfica
  const chartContainer = d3.select("#chart");

  // Filtro los datos para quedarme solo con Granada
  const filteredGranada = data.filter(d => d.Ciudad === "Granada Capital");

  // Filtro los barrios únicos
  const barriosUnicos = [...new Set(
    filteredGranada
      .map(d => d.Barrio)
      .filter(d => d != null)
  )].sort();

  let selectedBarrios = new Set(barriosUnicos);
  let allSelected = true;

  // Selecciono el contenedor de filtros
  const filters = d3.select("#filters-habitaciones-Granada");

  filters.html(`
    <div style="font-weight:700; margin-bottom:8px;">
      Selecciona qué barrios quieres ver:
    </div>
  `);

  const container = filters.append("div");

  // Creo el checkbox de todos los barrios
  container.append("label")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "6px")
    .style("margin-bottom", "8px")
    .html(`
      <input type="checkbox" id="select-all" checked>
      <span><b>Todos los barrios</b></span>
    `)
    .on("change", function () {

      const checked = this.querySelector("input").checked;

      allSelected = checked;

      selectedBarrios = checked
        ? new Set(barriosUnicos)
        : new Set();

      container.selectAll(".barrio-checkbox input")
        .property("checked", checked);

      updateChart();
    });

  // Creo la lista de barrios
  const barriosDiv = container.append("div")
    .style("display", "grid")
    .style("grid-template-columns", "repeat(2, 1fr)")
    .style("gap", "6px");

  barriosDiv.selectAll("label")
    .data(barriosUnicos)
    .join("label")
    .attr("class", "barrio-checkbox")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "6px")
    .html(d => `
      <input type="checkbox" checked value="${d}">
      <span>${d}</span>
    `)
    .on("change", function (event, d) {

      const checked = this.querySelector("input").checked;

      if (checked) selectedBarrios.add(d);
      else selectedBarrios.delete(d);

      const allChecked = selectedBarrios.size === barriosUnicos.length;

      allSelected = allChecked;

      filters.select("#select-all")
        .property("checked", allChecked);

      updateChart();
    });

  // Creo la ventana emergente
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.85)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Limpio el contenedor principal
  chartContainer.html("");

  const wrapper = chartContainer
    .append("div")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  const svgContainer = wrapper.append("div");

  // Creo la leyenda
  const legend = wrapper.append("div")
    .style("margin-bottom", "20px")
    .style("display", "grid")
    .style("grid-template-columns", "repeat(auto-fit, minmax(140px, 1fr))")
    .style("gap", "8px")
    .style("width", `${width}px`)
    .style("font-size", "11px");

  // Actualizo la leyenda según los datos visibles
  function updateLegend(color, items) {

    legend.html("");

    items.forEach(b => {

      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("font-size", "12px");

      item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("margin-right", "6px")
        .style("background", color(b));

      item.append("span").text(`${b} habitaciones`);
    });
  }

  // Función principal de actualización del gráfico
  function updateChart() {

    // Borro el SVG anterior
    svgContainer.selectAll("svg").remove();

    const svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Filtro los datos por barrios seleccionados y habitaciones válidas
    let base = filteredGranada.filter(d =>
      selectedBarrios.has(d.Barrio) &&
      d.Habitaciones != null
    );

    // Agrupo por barrio y habitaciones
    const grouped = d3.rollups(
      base,
      v => d3.mean(v, d => +d["Precio del m2 (€/m2)"]),
      d => d.Barrio,
      d => d.Habitaciones
    );

    const barrios = grouped.map(([barrio, values]) => {

      let arr = values.map(([hab, mean]) => ({
        hab: +hab,
        mean
      }));

      arr = arr.sort((a, b) => d3.ascending(a.hab, b.hab));

      return { barrio, values: arr };
    })
    .sort((a, b) => a.barrio.localeCompare(b.barrio));

    // Valores únicos de habitaciones
    const habitacionesValues = [...new Set(base.map(d => +d.Habitaciones))];

    const color = d3.scaleOrdinal()
      .domain(habitacionesValues)
      .range(d3.schemeTableau10);

    // Escala X
    const x0 = d3.scaleBand()
      .domain(barrios.map(d => d.barrio))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Escala Y
    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(barrios, b => d3.max(b.values, v => v.mean))
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Agrupo barras por barrio
    const groups = svg.selectAll(".group")
      .data(barrios)
      .join("g")
      .attr("transform", d => `translate(${x0(d.barrio)},0)`);

    groups.each(function (d) {

      const x1 = d3.scaleBand()
        .domain(d.values.map(v => v.hab))
        .range([0, x0.bandwidth()])
        .padding(0.25);

      const group = d3.select(this);

      group.selectAll("rect")
        .data(d.values)
        .join("rect")
        .attr("x", v => x1(v.hab))
        .attr("y", v => y(v.mean))
        .attr("width", x1.bandwidth())
        .attr("height", v => y(0) - y(v.mean))
        .attr("fill", v => color(v.hab))
        .on("mouseover", (event, v) => {
          tooltip.style("opacity", 1)
            .html(`
              <b>${d.barrio}</b><br>
              Habitaciones: ${v.hab}<br>
              Precio: ${v.mean.toFixed(2)} €/m²
            `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });

    // Título de la gráfica
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Precio medio €/m² por barrio y número de habitaciones en Granada");

    // Eje X
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Eje Y
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Títulos de los ejes
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Barrio");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Precio del m2 (€/m2)");

    // Actualizo la leyenda
    updateLegend(color, habitacionesValues);
  }

  updateChart();
}