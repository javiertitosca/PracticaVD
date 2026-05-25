import { storyCiudades } from "./branches.js";

// Función principal del storytelling
export function historiaInicial(datos) {

  // Se seleccionan los pasos del scroll narrative
  const steps = document.querySelectorAll(".step");

  // Observer para detectar los cambios de step
  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      // Si el elemento no está visible, no hacemos nada
      if (!entry.isIntersecting) return;

      // Se identifica el step
      const step = entry.target.dataset.step;

      // Se limpia el contenedor donde se va a poner la gráfica
      d3.select("#chart").html("");

      // Muestro la story que contiene las distintas ramas de ciudades
      if (step === "1") {
        storyCiudades(datos);
      }

    });

  }, {
    // Límite para cuando cambiar de paso y por tanto de gráfica
    threshold: 0.6
  });

  // Se activa observer sobre cada sección del scroll
  steps.forEach(s => observer.observe(s));
}