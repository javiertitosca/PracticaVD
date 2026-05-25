export function graficaPlantasBarcelona(data) {

  const width = 850;
  const height = 600;

  const margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
  };

  const chartContainer = d3.select("#chart");

  const filteredBarcelona = data.filter(d =>
    d.Ciudad === "Barcelona Capital"
  );

  // =========================
  // BARRIOS
  // =========================
  const barriosUnicos = [...new Set(
    filteredBarcelona
      .map(d => d.Barrio)
      .filter(d => d != null && d !== "" && d !== "null")
  )].sort();

  let selectedBarrios = new Set(barriosUnicos);

  // =========================
  // CHECKBOX UI
  // =========================
  const filters = d3.select("#filters-plantas-Barcelona");

  filters.html(`
    <div style="font-weight:700; margin-bottom:8px;">
      Selecciona barrios:
    </div>
  `);

  const container = filters.append("div");

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

  // =========================
  // TOOLTIP
  // =========================
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

  // =========================
  // WRAPPER
  // =========================
  chartContainer.html("");

  const wrapper = chartContainer
    .append("div")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  const svgContainer = wrapper.append("div");

  const legend = wrapper.append("div")
    .style("margin-bottom", "20px")
    .style("display", "grid")
    .style("grid-template-columns", "repeat(auto-fit, minmax(140px, 1fr))")
    .style("gap", "8px")
    .style("width", `${width}px`)
    .style("font-size", "11px");

  function updateLegend(color, plantas) {

    legend.html("");

    plantas.forEach(t => {

      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("font-size", "12px");

      item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("margin-right", "6px")
        .style("background", color(t));

      item.append("span").text(`${t}º Planta`);
    });
  }

  // =========================
  // CHART
  // =========================
  function updateChart() {

    svgContainer.selectAll("svg").remove();

    const svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // =========================
    // FILTRADO LIMPIO
    // =========================
    const base = filteredBarcelona.filter(d =>
      selectedBarrios.has(d.Barrio) &&
      d.Planta != null &&
      d.Planta !== "" &&
      d.Planta !== "null"
    );

    // =========================
    // AGRUPACIÓN
    // =========================
    const grouped = d3.rollups(
      base,
      v => d3.mean(v, d => +d["Precio del m2 (€/m2)"]),
      d => d.Barrio,
      d => d.Planta
    );

    const barrios = grouped.map(([barrio, values]) => {

      const arr = values
        .filter(([planta]) =>
          planta != null && planta !== "" && planta !== "null"
        )
        .map(([planta, mean]) => ({
          planta,
          mean
        }));

      return { barrio, values: arr };
    });

    // =========================
    // COLOR LIMPIO
    // =========================
    const allPlantas = [...new Set(
      base.map(d => d.Planta)
    )];

    const color = d3.scaleOrdinal()
      .domain(allPlantas)
      .range(d3.schemeTableau10);

    // =========================
    // ESCALAS
    // =========================
    const x0 = d3.scaleBand()
      .domain(barrios.map(d => d.barrio))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(barrios, b =>
          d3.max(b.values, v => v.mean)
        )
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // =========================
    // BARRAS
    // =========================
    const groups = svg.selectAll(".group")
      .data(barrios)
      .join("g")
      .attr("transform", d => `translate(${x0(d.barrio)},0)`);

    groups.each(function (d) {

      const x1 = d3.scaleBand()
        .domain(d.values.map(v => v.planta))
        .range([0, x0.bandwidth()])
        .padding(0.25);

      const group = d3.select(this);

      group.selectAll("rect")
        .data(d.values)
        .join("rect")
        .attr("x", v => x1(v.planta))
        .attr("y", v => y(v.mean))
        .attr("width", x1.bandwidth())
        .attr("height", v => y(0) - y(v.mean))
        .attr("fill", v => color(v.planta))
        .on("mouseover", (event, v) => {
          tooltip.style("opacity", 1)
            .html(`
              <b>${d.barrio}</b><br>
              <b>Planta:</b> ${v.planta}<br>
              <b>Precio:</b> ${v.mean.toFixed(2)} €/m²
            `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });

    // =========================
    // EJES
    // =========================
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // =========================
    // TÍTULO BONITO
    // =========================
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Precio €/m² por barrio y planta en Barcelona");

    // =========================
    // LABELS
    // =========================
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
      .text("Precio del m2 (€/m²)");

    // =========================
    // LEYENDA
    // =========================
    updateLegend(color, allPlantas);
  }

  updateChart();
}