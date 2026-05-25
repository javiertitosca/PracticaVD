import { cargaDatos } from "./data.js";
import { preprocesarDatos } from "./data.js";
import { historiaInicial } from "./story.js";

cargaDatos().then(datos => {
  historiaInicial(datos);
});