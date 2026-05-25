export function graficaDiferenciasValencia(data) {

  // Defino dimensiones de la gráfica
  const width = 850;
  const height = 600;

  const margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
  };

  // Selecciono el contenedor donde va la gráfica
  const chartContainer = d3.select("#chart");
  const filters = d3.select("#filters-diferencias-Valencia");

  // Filtro los datos para quedarme solo con Valencia
  const filteredValencia = data.filter(d => d.Ciudad === "Valencia Capital");

  // Defino las características que voy a analizar
  const featuresAll = [
    "Ascensor",
    "Terraza",
    "Parking",
    "Calefacción",
    "Aire",
    "Balcón"
  ];

  // Saco los barrios únicos
  const barriosUnicos = [...new Set(filteredValencia.map(d => d.Barrio))].sort();

  let selectedBarrios = new Set(barriosUnicos);
  let selectedFeatures = new Set(featuresAll);

  // Función para saber si una vivienda tiene una característica
  const hasFeature = (d, feature) => {
    const v = d[feature];
    return v === true;
  };

  // Creo el panel de filtros
  filters.html(`
    <div style="font-weight:700; margin-bottom:8px;">
      Selecciona barrios:
    </div>
  `);

  const container = filters.append("div");

  // Checkbox de seleccionar todos los barrios
  container.append("label")
    .style("display", "flex")
    .style("gap", "6px")
    .style("margin-bottom", "8px")
    .html(`
      <input type="checkbox" id="select-all-barrios" checked>
      <span><b>Todos los barrios</b></span>
    `)
    .on("change", function () {

      const checked = this.querySelector("input").checked;

      selectedBarrios = checked
        ? new Set(barriosUnicos)
        : new Set();

      container.selectAll(".barrio input")
        .property("checked", checked);

      updateChart();
    });

  // Lista de barrios
  const barriosDiv = container.append("div")
    .style("display", "grid")
    .style("grid-template-columns", "repeat(2, 1fr)")
    .style("gap", "6px");

  barriosDiv.selectAll("label")
    .data(barriosUnicos)
    .join("label")
    .attr("class", "barrio")
    .style("display", "flex")
    .html(d => `
      <input type="checkbox" checked value="${d}">
      <span>${d}</span>
    `)
    .on("change", function (event, d) {

      const checked = this.querySelector("input").checked;

      if (checked) selectedBarrios.add(d);
      else selectedBarrios.delete(d);

      const allChecked = selectedBarrios.size === barriosUnicos.length;

      filters.select("#select-all-barrios")
        .property("checked", allChecked);

      updateChart();
    });

  // Filtros de características
  container.append("div")
    .style("margin-top", "15px")
    .style("font-weight", "700")
    .text("Selecciona características:");

  const featuresDiv = container.append("div")
    .style("display", "grid")
    .style("grid-template-columns", "repeat(2, 1fr)")
    .style("gap", "6px")
    .style("margin-top", "8px");

  featuresDiv.selectAll("label")
    .data(featuresAll)
    .join("label")
    .style("display", "flex")
    .html(d => `
      <input type="checkbox" checked value="${d}">
      <span>${d}</span>
    `)
    .on("change", function (event, d) {

      const checked = this.querySelector("input").checked;

      if (checked) selectedFeatures.add(d);
      else selectedFeatures.delete(d);

      updateChart();
    });

  // Creo tooltip
  d3.selectAll(".tooltip-diferencias").remove();

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip-diferencias")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.85)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Defino colores por característica
  const color = d3.scaleOrdinal()
    .domain(featuresAll)
    .range(d3.schemeTableau10);

  // Limpio el contenedor
  chartContainer.html("");

  // Creo wrapper de la gráfica
  const wrapper = chartContainer
    .append("div")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  const svgContainer = wrapper.append("div");

  // Creo contenedor de leyenda
  const legendContainer = wrapper.append("div")
    .style("width", `${width}px`)
    .style("display", "grid")
    .style("grid-template-columns", "repeat(auto-fit, minmax(140px, 1fr))")
    .style("gap", "8px")
    .style("font-size", "12px");

  // Función principal que dibuja la gráfica
  function updateChart() {

    svgContainer.selectAll("svg").remove();

    const svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Filtro barrios seleccionados
    const base = filteredValencia.filter(d =>
      selectedBarrios.has(d.Barrio)
    );

    // Filtro características seleccionadas
    const features = featuresAll.filter(f =>
      selectedFeatures.has(f)
    );

    // Agrupo por barrio
    const grouped = d3.group(base, d => d.Barrio);

    const chartData = [];

    for (const [barrio, values] of grouped) {

      const row = { barrio };

      // Calculo diferencia media con y sin característica
      features.forEach(feature => {

        const con = values.filter(d => hasFeature(d, feature));
        const sin = values.filter(d => !hasFeature(d, feature));

        const mediaCon = d3.mean(con, d => +d["Precio del m2 (€/m2)"]);
        const mediaSin = d3.mean(sin, d => +d["Precio del m2 (€/m2)"]);

        row[feature] =
          (mediaCon != null && mediaSin != null)
            ? mediaCon - mediaSin
            : 0;
      });

      chartData.push(row);
    }

    const barrios = chartData.map(d => d.barrio);

    const allValues = chartData.flatMap(d =>
      features.map(f => d[f])
    );

    const maxAbs = d3.max(allValues, d => Math.abs(d));

    // Escala x por barrios
    const x0 = d3.scaleBand()
      .domain(barrios)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Escala y centrada en 0
    const y = d3.scaleLinear()
      .domain([-maxAbs, maxAbs])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Hago una línea central para marcar el 0 porque hay valores negativos
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#000")
      .attr("opacity", 0.5);

    // Hago grupos por barrio para distinguir las características
    const groups = svg.selectAll(".group")
      .data(chartData)
      .join("g")
      .attr("transform", d => `translate(${x0(d.barrio)},0)`);

    groups.each(function (d) {

      const x1 = d3.scaleBand()
        .domain(features)
        .range([0, x0.bandwidth()])
        .padding(0.2);

      const group = d3.select(this);

      group.selectAll("rect")
        .data(features.map(f => ({
          feature: f,
          value: d[f]
        })))
        .join("rect")
        .attr("x", v => x1(v.feature))
        .attr("y", v => y(Math.max(0, v.value)))
        .attr("width", x1.bandwidth())
        .attr("height", v => Math.abs(y(v.value) - y(0)))
        .attr("fill", v => color(v.feature))
        .on("mouseover", (event, v) => {
          tooltip.style("opacity", 1)
            .html(`
              <b>${d.barrio}</b><br>
              tener ${v.feature.toLowerCase()} supone una <br>
              diferencia media de ${v.value.toFixed(2)} €/m²
            `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });

    // Defino el formato del eje x
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Defino el formato del eje y
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Defino el título
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Precio €/m² por barrio y características en Valencia");

    // etiquetas ejes
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
      .text("Impacto en €/m²");

    // Leyenda
    legendContainer.html("");

    features.forEach(f => {

      const item = legendContainer.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px");

      item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("background", color(f));

      item.append("span")
        .text(f);
    });
  }

  updateChart();
}