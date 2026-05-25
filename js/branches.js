import { graficaBarriosMadrid } from "./charts/Branch Madrid/graficaBarriosMadrid.js";
import { graficaHabitacionesMadrid } from "./charts/Branch Madrid/graficaHabitacionesMadrid.js"
import { graficaBañosMadrid } from "./charts/Branch Madrid/graficaBañosMadrid.js";
import { graficaTiposMadrid } from "./charts/Branch Madrid/graficaTiposMadrid.js";
import { graficaPlantasMadrid } from "./charts/Branch Madrid/graficaPlantasMadrid.js";
import { graficaDiferenciasMadrid } from "./charts/Branch Madrid/graficaDiferenciasMadrid.js";

import { graficaBarriosBarcelona } from "./charts/Branch Barcelona/graficaBarriosBarcelona.js";
import { graficaHabitacionesBarcelona } from "./charts/Branch Barcelona/graficaHabitacionesBarcelona.js"
import { graficaBañosBarcelona } from "./charts/Branch Barcelona/graficaBañosBarcelona.js";
import { graficaTiposBarcelona } from "./charts/Branch Barcelona/graficaTiposBarcelona.js";
import { graficaPlantasBarcelona } from "./charts/Branch Barcelona/graficaPlantasBarcelona.js";
import { graficaDiferenciasBarcelona } from "./charts/Branch Barcelona/graficaDiferenciasBarcelona.js";

import { graficaBarriosGranada } from "./charts/Branch Granada/graficaBarriosGranada.js";
import { graficaHabitacionesGranada } from "./charts/Branch Granada/graficaHabitacionesGranada.js"
import { graficaBañosGranada } from "./charts/Branch Granada/graficaBañosGranada.js";
import { graficaTiposGranada } from "./charts/Branch Granada/graficaTiposGranada.js";
import { graficaPlantasGranada } from "./charts/Branch Granada/graficaPlantasGranada.js";
import { graficaDiferenciasGranada } from "./charts/Branch Granada/graficaDiferenciasGranada.js";

import { graficaBarriosMallorca } from "./charts/Branch Mallorca/graficaBarriosMallorca.js";
import { graficaHabitacionesMallorca } from "./charts/Branch Mallorca/graficaHabitacionesMallorca.js"
import { graficaBañosMallorca } from "./charts/Branch Mallorca/graficaBañosMallorca.js";
import { graficaTiposMallorca } from "./charts/Branch Mallorca/graficaTiposMallorca.js";
import { graficaPlantasMallorca } from "./charts/Branch Mallorca/graficaPlantasMallorca.js";
import { graficaDiferenciasMallorca } from "./charts/Branch Mallorca/graficaDiferenciasMallorca.js";


import { graficaBarriosValencia } from "./charts/Branch Valencia/graficaBarriosValencia.js";
import { graficaHabitacionesValencia } from "./charts/Branch Valencia/graficaHabitacionesValencia.js"
import { graficaBañosValencia } from "./charts/Branch Valencia/graficaBañosValencia.js";
import { graficaTiposValencia } from "./charts/Branch Valencia/graficaTiposValencia.js";
import { graficaPlantasValencia } from "./charts/Branch Valencia/graficaPlantasValencia.js";
import { graficaDiferenciasValencia } from "./charts/Branch Valencia/graficaDiferenciasValencia.js";


export function storyCiudades(datos) {
  d3.select("#chart").html(`
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      height:100%;
      color:#444;
      padding:40px;
      text-align:center;
    ">

      <h2>📊 Indicadores clave por ciudad</h2>

      <p style="max-width:420px;">
        Este panel muestra datos relativos a cómo se determinan los precios de los
        alquileres en cada una de las ciudades
      </p>

      <div style="margin-top:20px; font-size:14px; opacity:0.7;">
        Selecciona una ciudad con los botones 👈
      </div>

    </div>
  `);
  
  document.getElementById("btnMadrid").onclick = () => {
    branchMadrid(datos);
  };

  document.getElementById("btnBarcelona").onclick = () => {
    branchBarcelona(datos);
  };

  document.getElementById("btnGranada").onclick = () => {
    branchGranada(datos);
  };

  document.getElementById("btnMallorca").onclick = () => {
    branchMallorca(datos);
  };

  document.getElementById("btnValencia").onclick = () => {
    branchValencia(datos);
  };

}

function branchMadrid(datos) {

  // Ocultar historia principal
  document.getElementById("mainStory").style.display = "none";

  const branch = document.getElementById("branchStory");

  branch.style.display = "block";

  branch.scrollTop = 0;

  branch.innerHTML = `

    <section class="step branch-step" data-branch="1">
      <h2>Barrios</h2>
      <p>Precio medio por m2 en los distintos barrios de Madrid</p>
    </section>

    <section class="step branch-step" data-branch="2">

      <h2>Influencia del número de habitaciones</h2>
      <p>Precio medio del m2 por barrio en función del número de habitaciones</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-habitaciones-Madrid"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="3">

      <h2>Influencia del número de baños</h2>
      <p>Precio medio del m2 por barrio en función del número de baños</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-baños-Madrid"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="4">
      <h2>Influencia del tipo de vivienda</h2>
      <p>Precio medio del m2 por barrio en función del tipo de vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-tipos-Madrid"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="5">
      <h2>Influencia la planta</h2>
      <p>Precio medio del m2 por barrio en función de la planta de la vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-plantas-Madrid"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="6">
      <h2>Influencia de otras variables</h2>
      <p>Precio medio del m2 por barrio en función de si incluye adicionales como parking,
      calefacción, aire acondicionado, terraza, ascensor o balcón.</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-diferencias-Madrid"></div>
      </div>
    </section>

    

    <div class="backContainer">
      <button id="btnBack">
        ⬅ Volver atrás
      </button>
    </div>

  `;

  document.getElementById("btnBack").onclick = volverStoryOriginal;

  scrollBranchMadrid(datos);
}

function scrollBranchMadrid(datos) {

  const steps = document.querySelectorAll(".branch-step");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const step = entry.target.dataset.branch;

      d3.select("#filters").html("");
      d3.select("#chart").html("");

      if (step === "1") {
        graficaBarriosMadrid(datos);
      }

      if (step === "2") {
        graficaHabitacionesMadrid(datos);
      }

      if (step === "3") {
        graficaBañosMadrid(datos);
      }

      if (step === "4") {
        graficaTiposMadrid(datos);
      }

      if (step === "5") {
        graficaPlantasMadrid(datos);
      }

      if (step === "6") {
        graficaDiferenciasMadrid(datos);
      }


    });

  }, { threshold: 0.6 });

  steps.forEach(s => observer.observe(s));
}

function branchBarcelona(datos) {

  // Ocultar historia principal
  document.getElementById("mainStory").style.display = "none";

  const branch = document.getElementById("branchStory");

  branch.style.display = "block";

  branch.scrollTop = 0;

  branch.innerHTML = `

    <section class="step branch-step" data-branch="1">
      <h2>Barrios</h2>
      <p>Precio medio por m2 en los distintos barrios de Barcelona</p>
    </section>

    <section class="step branch-step" data-branch="2">

      <h2>Influencia del número de habitaciones</h2>
      <p>Precio medio del m2 por barrio en función del número de habitaciones</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-habitaciones-Barcelona"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="3">

      <h2>Influencia del número de baños</h2>
      <p>Precio medio del m2 por barrio en función del número de baños</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-baños-Barcelona"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="4">
      <h2>Influencia del tipo de vivienda</h2>
      <p>Precio medio del m2 por barrio en función del tipo de vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-tipos-Barcelona"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="5">
      <h2>Influencia del tipo de diferencias</h2>
      <p>Precio medio del m2 por barrio en función de la planta de la vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-plantas-Barcelona"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="6">
      <h2>Influencia de otras variables</h2>
      <p>Precio medio del m2 por barrio en función de si incluye adicionales como parking,
      calefacción, aire acondicionado, terraza, ascensor o balcón.</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-diferencias-Barcelona"></div>
      </div>
    </section>

    

    <div class="backContainer">
      <button id="btnBack">
        ⬅ Volver atrás
      </button>
    </div>

  `;

  document.getElementById("btnBack").onclick = volverStoryOriginal;

  scrollBranchBarcelona(datos);
}

function scrollBranchBarcelona(datos) {

  const steps = document.querySelectorAll(".branch-step");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const step = entry.target.dataset.branch;

      d3.select("#filters").html("");
      d3.select("#chart").html("");

      if (step === "1") {
        graficaBarriosBarcelona(datos);
      }

      if (step === "2") {
        graficaHabitacionesBarcelona(datos);
      }

      if (step === "3") {
        graficaBañosBarcelona(datos);
      }

      if (step === "4") {
        graficaTiposBarcelona(datos);
      }

      if (step === "5") {
        graficaPlantasBarcelona(datos);
      }

      if (step === "6") {
        graficaDiferenciasBarcelona(datos);
      }


    });

  }, { threshold: 0.6 });

  steps.forEach(s => observer.observe(s));
}

function branchGranada(datos) {

  // Ocultar historia principal
  document.getElementById("mainStory").style.display = "none";

  const branch = document.getElementById("branchStory");

  branch.style.display = "block";

  branch.scrollTop = 0;

  branch.innerHTML = `

    <section class="step branch-step" data-branch="1">
      <h2>Barrios</h2>
      <p>Precio medio por m2 en los distintos barrios de Granada</p>
    </section>

    <section class="step branch-step" data-branch="2">

      <h2>Influencia del número de habitaciones</h2>
      <p>Precio medio del m2 por barrio en función del número de habitaciones</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-habitaciones-Granada"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="3">

      <h2>Influencia del número de baños</h2>
      <p>Precio medio del m2 por barrio en función del número de baños</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-baños-Granada"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="4">
      <h2>Influencia del tipo de vivienda</h2>
      <p>Precio medio del m2 por barrio en función del tipo de vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-tipos-Granada"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="5">
      <h2>Influencia del tipo de diferencias</h2>
      <p>Precio medio del m2 por barrio en función de la planta de la vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-plantas-Granada"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="6">
      <h2>Influencia de otras variables</h2>
      <p>Precio medio del m2 por barrio en función de si incluye adicionales como parking,
      calefacción, aire acondicionado, terraza, ascensor o balcón.</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-diferencias-Granada"></div>
      </div>
    </section>

    

    <div class="backContainer">
      <button id="btnBack">
        ⬅ Volver atrás
      </button>
    </div>

  `;

  document.getElementById("btnBack").onclick = volverStoryOriginal;

  scrollBranchGranada(datos);
}

function scrollBranchGranada(datos) {

  const steps = document.querySelectorAll(".branch-step");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const step = entry.target.dataset.branch;

      d3.select("#filters").html("");
      d3.select("#chart").html("");

      if (step === "1") {
        graficaBarriosGranada(datos);
      }

      if (step === "2") {
        graficaHabitacionesGranada(datos);
      }

      if (step === "3") {
        graficaBañosGranada(datos);
      }

      if (step === "4") {
        graficaTiposGranada(datos);
      }

      if (step === "5") {
        graficaPlantasGranada(datos);
      }

      if (step === "6") {
        graficaDiferenciasGranada(datos);
      }


    });

  }, { threshold: 0.6 });

  steps.forEach(s => observer.observe(s));
}

function branchMallorca(datos) {

  // Ocultar historia principal
  document.getElementById("mainStory").style.display = "none";

  const branch = document.getElementById("branchStory");

  branch.style.display = "block";

  branch.scrollTop = 0;

  branch.innerHTML = `

    <section class="step branch-step" data-branch="1">
      <h2>Barrios</h2>
      <p>Precio medio por m2 en los distintos barrios de Mallorca</p>
    </section>

    <section class="step branch-step" data-branch="2">

      <h2>Influencia del número de habitaciones</h2>
      <p>Precio medio del m2 por barrio en función del número de habitaciones</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-habitaciones-Mallorca"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="3">

      <h2>Influencia del número de baños</h2>
      <p>Precio medio del m2 por barrio en función del número de baños</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-baños-Mallorca"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="4">
      <h2>Influencia del tipo de vivienda</h2>
      <p>Precio medio del m2 por barrio en función del tipo de vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-tipos-Mallorca"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="5">
      <h2>Influencia del tipo de diferencias</h2>
      <p>Precio medio del m2 por barrio en función de la planta de la vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-plantas-Mallorca"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="6">
      <h2>Influencia de otras variables</h2>
      <p>Precio medio del m2 por barrio en función de si incluye adicionales como parking,
      calefacción, aire acondicionado, terraza, ascensor o balcón.</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-diferencias-Mallorca"></div>
      </div>
    </section>

    

    <div class="backContainer">
      <button id="btnBack">
        ⬅ Volver atrás
      </button>
    </div>

  `;

  document.getElementById("btnBack").onclick = volverStoryOriginal;

  scrollBranchMallorca(datos);
}

function scrollBranchMallorca(datos) {

  const steps = document.querySelectorAll(".branch-step");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const step = entry.target.dataset.branch;

      d3.select("#filters").html("");
      d3.select("#chart").html("");

      if (step === "1") {
        graficaBarriosMallorca(datos);
      }

      if (step === "2") {
        graficaHabitacionesMallorca(datos);
      }

      if (step === "3") {
        graficaBañosMallorca(datos);
      }

      if (step === "4") {
        graficaTiposMallorca(datos);
      }

      if (step === "5") {
        graficaPlantasMallorca(datos);
      }

      if (step === "6") {
        graficaDiferenciasMallorca(datos);
      }


    });

  }, { threshold: 0.6 });

  steps.forEach(s => observer.observe(s));
}

function branchValencia(datos) {

  // Ocultar historia principal
  document.getElementById("mainStory").style.display = "none";

  const branch = document.getElementById("branchStory");

  branch.style.display = "block";

  branch.scrollTop = 0;

  branch.innerHTML = `

    <section class="step branch-step" data-branch="1">
      <h2>Barrios</h2>
      <p>Precio medio por m2 en los distintos barrios de Valencia</p>
    </section>

    <section class="step branch-step" data-branch="2">

      <h2>Influencia del número de habitaciones</h2>
      <p>Precio medio del m2 por barrio en función del número de habitaciones</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-habitaciones-Valencia"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="3">

      <h2>Influencia del número de baños</h2>
      <p>Precio medio del m2 por barrio en función del número de baños</p>

      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-baños-Valencia"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="4">
      <h2>Influencia del tipo de vivienda</h2>
      <p>Precio medio del m2 por barrio en función del tipo de vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-tipos-Valencia"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="5">
      <h2>Influencia del tipo de diferencias</h2>
      <p>Precio medio del m2 por barrio en función de la planta de la vivienda</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-plantas-Valencia"></div>
      </div>
    </section>

    <section class="step branch-step" data-branch="6">
      <h2>Influencia de otras variables</h2>
      <p>Precio medio del m2 por barrio en función de si incluye adicionales como parking,
      calefacción, aire acondicionado, terraza, ascensor o balcón.</p>
      <div style="
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 14px;
      ">
        <div id="filters-diferencias-Valencia"></div>
      </div>
    </section>

    

    <div class="backContainer">
      <button id="btnBack">
        ⬅ Volver atrás
      </button>
    </div>

  `;

  document.getElementById("btnBack").onclick = volverStoryOriginal;

  scrollBranchValencia(datos);
}

function scrollBranchValencia(datos) {

  const steps = document.querySelectorAll(".branch-step");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const step = entry.target.dataset.branch;

      d3.select("#filters").html("");
      d3.select("#chart").html("");

      if (step === "1") {
        graficaBarriosValencia(datos);
      }

      if (step === "2") {
        graficaHabitacionesValencia(datos);
      }

      if (step === "3") {
        graficaBañosValencia(datos);
      }

      if (step === "4") {
        graficaTiposValencia(datos);
      }

      if (step === "5") {
        graficaPlantasValencia(datos);
      }

      if (step === "6") {
        graficaDiferenciasValencia(datos);
      }


    });

  }, { threshold: 0.6 });

  steps.forEach(s => observer.observe(s));
}

function volverStoryOriginal() {

  // ocultar rama
  document.getElementById("branchStory").style.display = "none";

  // mostrar main
  document.getElementById("mainStory").style.display = "block";

  // limpiar gráfico
  d3.select("#chart").html("");

}


