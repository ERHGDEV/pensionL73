export const formularioTemplate = `
<div id="container">
  
  <h1>Calculadora de pensión</h1>
  
  <h2>Trabajador IMSS ley 73</h2>
  
  <section id="formulario"> 
    <br>
    <label>Ingresa los siguientes datos:</label><br><br>
    
    <table id="formularioDatos">
      <tr>
        <td class="text-label" >Salario mensual:</td>
        <td><input type="number" id="salPromedio" placeholder="Prom últimos 5 años" min="7467.91"></td>
      </tr>
      <tr>
        <td class="text-label" >Semanas cotizadas:</td>
        <td><input type="number" id="semCotizadas" min="0"></td>
      </tr>
      <tr>
        <td class="text-label" >Edad:</td>
        <td><input type="number" id="edad" min="40"></td>
      </tr>
      <tr>
        <td class="text-label" >Estado civil:</td>
        <td> <select name="estadoCivil" id="estadoCivil">
          <option value="0">Solter@</option>
          <option value="1">Casad@</option>
        </select></td>
      </tr>
      <tr>
        <td class="text-label" >Hijos:</td>
        <td> <select name="hijos" id="hijos">
          <option value="0">No</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select></td>
      </tr>
    </table><br>
    
    <button id="calc";" style="display: none;" >Calcular</button>

    <br>
    <div id="errores"></div>
    <br>
  </section>

  <section id="resultado">
    <button id="regresar" style="display: none;">Regresar</button>
    <br>
    <br>
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

    <br>
    <button id="generarPDF" style="display:none;">Generar PDF</button>
  </section>
</div>
`

export const landingTemplate = `
<div id="landingPage">
<header>
  <div class="container">
    <h2>Calculadora de pensión</h2>
    <h3>Para trabajadores IMSS Ley 73</h3>
  </div>
</header>

<section id="landingAction">
  <h1>Realiza la proyección de tu pensión</h1>
  <button id="goToCalculadora">Ir a calculadora</button>
</section>

<section id="landingInfo">
  <div class="container">
    <div class="info">
      <p>Conoce el importe aproximado de tu pensión</p>
    </div>
  
    <div class="info">
      <p>Identifica cómo incrementar tu pensión</p>
    </div>
  
    <div class="info">
      <p>Descubre a que edad te beneficia realizar el trámite</p>
    </div>
  </div>
</section>
</div>
`