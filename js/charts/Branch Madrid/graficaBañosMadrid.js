export function graficaBañosMadrid(data) {

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

  // Filtro los datos para quedarme solo con Madrid
  const filteredMadrid = data.filter(d => d.Ciudad === "Madrid Capital");

  // Filtro los barrios nulos
  const barriosUnicos = [...new Set(
    filteredMadrid
      .map(d => d.Barrio)
      .filter(d => d != null)
  )].sort();

  let selectedBarrios = new Set(barriosUnicos);

  // Selecciono los filtros aplicables a esta gráfica
  const filters = d3.select("#filters-baños-Madrid");

  filters.html(`
    <div style="font-weight:700; margin-bottom:8px;">
      Selecciona qué barrios quieres ver:
    </div>
  `);

  const container = filters.append("div");

  // Creo los checkboxes para el filtro
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

      selectedBarrios = checked
        ? new Set(barriosUnicos)
        : new Set();

      container.selectAll(".barrio-checkbox input")
        .property("checked", checked);

      updateChart();
    });

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

  // Creo el wrapper de la gráfica
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

  // Creo la función que actualiza la leyenda en función de los filtros
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

      item.append("span").text(`${b} baños`);
    });
  }

  // Función para actualizar el gráfico en función de los filtros
  function updateChart() {

    // Borro el contenedor antiguo y creo uno nuevo
    svgContainer.selectAll("svg").remove();

    const svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Filtro los barrios nulos
    const base = filteredMadrid.filter(d =>
      selectedBarrios.has(d.Barrio) &&
      d.Baños != null
    );

    // Calculo la media del precio por barrios y número de baños
    const grouped = d3.rollups(
      base,
      v => d3.mean(v, d => +d["Precio del m2 (€/m2)"]),
      d => d.Barrio,
      d => d.Baños
    );

    const barrios = grouped.map(([barrio, values]) => {

      let arr = values.map(([baños, mean]) => ({
        baños: +baños,
        mean
      }));

      arr = arr.sort((a, b) => d3.ascending(a.baños, b.baños));

      return { barrio, values: arr };
    });

    // Doy color a la leyenda
    const bañosValues = [...new Set(
      base.map(d => +d.Baños)
    )];

    const color = d3.scaleOrdinal()
      .domain(bañosValues)
      .range(d3.schemeTableau10);

    // Defino la escala del eje x
    const x0 = d3.scaleBand()
      .domain(barrios.map(d => d.barrio))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Defino la escala del eje y
    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(barrios, b => d3.max(b.values, v => v.mean))
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Creo un grupo para cada barrio para poder agrupar el número de baños
    // por barrio
    const groups = svg.selectAll(".group")
      .data(barrios)
      .join("g")
      .attr("transform", d => `translate(${x0(d.barrio)},0)`);

    groups.each(function (d) {

      const x1 = d3.scaleBand()
        .domain(d.values.map(v => v.baños))
        .range([0, x0.bandwidth()])
        .padding(0.25);

      const group = d3.select(this);

      group.selectAll("rect")
        .data(d.values)
        .join("rect")
        .attr("x", v => x1(v.baños))
        .attr("y", v => y(v.mean))
        .attr("width", x1.bandwidth())
        .attr("height", v => y(0) - y(v.mean))
        .attr("fill", v => color(v.baños))
        .on("mouseover", (event, v) => {
          tooltip.style("opacity", 1)
            .html(`
              <b>${d.barrio}</b><br>
              Baños: ${v.baños}<br>
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

    // Creo el título
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Precio medio €/m² por barrio y número de baños en Madrid");

    // Creo el eje X y el Y
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Doy formato a los ejes
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

    // Función que actualiza la leyenda
    updateLegend(color, bañosValues);
  }

  updateChart();
}