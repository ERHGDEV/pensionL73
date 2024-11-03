export const formularioTemplate = `
<div id="container">

  <div id="warning">
    <p>Esta aplicación dejó de estar disponible.</p>
    <p>Utiliza la nueva versión, ingresa a <a class="white-link" href="https://pensiona-t.vercel.app/">https://pensiona-t.vercel.app/</a></p>
  </div>
  
  <h1>Calculadora de pensión</h1>
  
  <h2>Trabajador IMSS ley 73</h2>
  
    <section id="formulario"> 
      
      <header class="form-title">Ingresa los siguientes datos:</header>
      
      <section id="formularioDatos">
        
        <div class="form-row">
          <label class="text-label">Salario mensual:</label>
          <input type="number" id="salPromedio" placeholder="Prom últimos 5 años" min="7467.91" required>
        </div>

        <div class="form-row">
          <label class="text-label" >Semanas cotizadas:</label>
          <input type="number" id="semCotizadas" min="0" required>
        </div>

        <div class="form-row">
          <label class="text-label" >Edad:</label>
          <input type="number" id="edad" min="40" required>
        </div>
        
        <div class="form-row">
          <label class="text-label" >Estado civil:</label>
          <select name="estadoCivil" id="estadoCivil">
            <option value="0">Solter@</option>
            <option value="1">Casad@</option>
          </select>
        </div>
        
        <div class="form-row">
          <label class="text-label" >Hijos:</label>
          <select name="hijos" id="hijos">
            <option value="0">No</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      
      </section>
      
      <div id="errores"></div>

      <button id="calc" style="display: none;" >Calcular</button>
    </section>

  <section id="resultado" style="display:none;">
    
    <table id="resultTable" style="display:none;">
      <thead>
        <tr>
          <th>Edad de pensión</th>
          <th>Porcentaje</th>
          <th>Pensión Mensual</th>
        </tr>
      </thead>
      <tbody id="resultBody"></tbody>
    </table>
    <button id="regresar" style="display: none;">Regresar</button>
    <button id="generarPDF" style="display:none;">Generar PDF</button>
  </section>
</div>

`

