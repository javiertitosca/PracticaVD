export function graficaBarriosMadrid(data) {

  // Defino dimensiones y márgenes de la gráfica
  const width = 850;
  const height = 600;

  const margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
  };

  // Creo el contenedor SVG donde se dibuja la gráfica
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Filtro los datos para quedarme solo con Madrid 
  const filtered = data.filter(d => d.Ciudad === "Madrid Capital");

  // Calculo las medias de precios de los barrios
  const grouped = d3.rollups(
    filtered,
    v => d3.mean(v, d => +d["Precio del m2 (€/m2)"]),
    d => d.Barrio
  );

  // Ordeno los barrios por precio medio
  const barriosOrdenados = grouped
    .map(([barrio, mean]) => ({ barrio, mean }))
    .sort((a, b) => d3.descending(a.mean, b.mean));

  // Defino la escala del eje X
  const x = d3.scaleBand()
    .domain(barriosOrdenados.map(d => d.barrio))
    .range([margin.left, width - margin.right])
    .padding(0.4);

  // Defino la escala del eje Y
  const y = d3.scaleLinear()
    .domain([0, d3.max(barriosOrdenados, d => d.mean)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Creo la ventana emergente
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Dibujo las barras
  svg.selectAll(".bar")
    .data(barriosOrdenados)
    .join("rect")
    .attr("x", d => x(d.barrio))                 
    .attr("y", d => y(d.mean))                  
    .attr("width", x.bandwidth())                
    .attr("height", d => y(0) - y(d.mean))       
    .attr("fill", "steelblue")                   

    // Creo el evento para la ventana emergente al pasar el ratón
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
        .html(`
          <b>Barrio:</b> ${d.barrio}<br>
          <b>€/m² medio:</b> ${d.mean.toFixed(2)}
        `);
    })

    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    })

    // Oculto la ventana emergente al salir
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Doy formato al eje X
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-45)");

  // Doy formato al eje Y
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // Título de la gráfica
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text("Precio medio €/m² por barrio en Madrid");

  // Nombre del eje X
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Barrio");

  // Nombre del eje Y
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Precio del m2 (€/m2)");
}