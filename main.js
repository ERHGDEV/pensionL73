import jsPDF from "jspdf"
import 'jspdf-autotable'
import './style.css'

document.querySelector('#app').innerHTML = `
  <div id="container">
    
    <h1>Calculadora de pensión</h1>
    
    <h2>Trabajador IMSS ley 73</h2>
    
    <section id="formulario">
      <label>Ingresa los siguientes datos:</label><br><br>
      
      <table id="formularioDatos">
        <tr>
          <td>Salario mensual:</td>
          <td><input type="number" id="salPromedio" placeholder="Promedio últimos 5 años"></td>
        </tr>
        <tr>
          <td>Semanas cotizadas:</td>
          <td><input type="number" id="semCotizadas"></td>
        </tr>
        <tr>
          <td>Edad:</td>
          <td><input type="number" id="edad"></td>
        </tr>
        <tr>
          <td>Estado civil:</td>
          <td> <select name="estadoCivil" id="estadoCivil">
            <option value="0">Solter@</option>
            <option value="1">Casad@</option>
          </select></td>
        </tr>
        <tr>
          <td>Hijos:</td>
          <td> <select name="hijos" id="hijos">
            <option value="0">No</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select></td>
        </tr>
      </table><br>
      
      <button id="calc" style="display:none;">Calcular</button>

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

const salPromedioInput = document.getElementById('salPromedio')
const semCotizadasInput = document.getElementById('semCotizadas')
const edadInput = document.getElementById('edad')
const erroresDiv = document.getElementById('errores')
const resultTable = document.getElementById('resultTable')
const resultBody = document.getElementById('resultBody')
const generarPDFButton = document.getElementById('generarPDF')
const calcularButton = document.getElementById('calc')
const regresarButton = document.getElementById('regresar')

//Variables para imprimir en el pdf
let semanasCotizadasTotalesPDF, cuantiaPDF, incrementosPDF, cuantiaMensualPDF, numeroIncrementosPDF, cuantiaIncrementosPDF, sumaCuantiasPDF, asigConyuguePDF, asigHijosPDF, ayudaAsistencialPDF, cuantiaTotalPDF

//Constantes
const salarioMinimoVigente = 248.93  //es necesario actualizarlo al cambiar año
const uma = 108.57 //actualizar 1ero de febrero de cada año
const edadesPorcentajes = [60, 61, 62, 63, 64, '65 o más']
const porcentajes = [0.75, 0.80, 0.85, 0.90, 0.95, 1.00]
const tabulador = [
  { min: 1.00, max: 1.25, cuantiaBasica: 80.000, incrementoAnual: 0.563 },
  { min: 1.26, max: 1.5, cuantiaBasica: 77.110, incrementoAnual: 0.814 },
  { min: 1.51, max: 1.75, cuantiaBasica: 58.180, incrementoAnual: 1.178 },
  { min: 1.76, max: 2, cuantiaBasica: 49.230, incrementoAnual: 1.430 },
  { min: 2.01, max: 2.25, cuantiaBasica: 42.670, incrementoAnual: 1.615 },
  { min: 2.26, max: 2.5, cuantiaBasica: 37.650, incrementoAnual: 1.756 },
  { min: 2.51, max: 2.75, cuantiaBasica: 33.680, incrementoAnual: 1.868 },
  { min: 2.76, max: 3, cuantiaBasica: 30.480, incrementoAnual: 1.958 },
  { min: 3.01, max: 3.25, cuantiaBasica: 27.830, incrementoAnual: 2.033 },
  { min: 3.26, max: 3.5, cuantiaBasica: 25.600, incrementoAnual: 2.096 },
  { min: 3.51, max: 3.75, cuantiaBasica: 23.700, incrementoAnual: 2.149 },
  { min: 3.75, max: 4, cuantiaBasica: 22.070, incrementoAnual: 2.195 },
  { min: 4.01, max: 4.25, cuantiaBasica: 20.650, incrementoAnual: 2.235 },
  { min: 4.26, max: 4.5, cuantiaBasica: 19.390, incrementoAnual: 2.271 },
  { min: 4.51, max: 4.75, cuantiaBasica: 18.290, incrementoAnual: 2.302 },
  { min: 4.76, max: 5, cuantiaBasica: 17.300, incrementoAnual: 2.330 },
  { min: 5.01, max: 5.25, cuantiaBasica: 16.410, incrementoAnual: 2.355 },
  { min: 5.26, max: 5.5, cuantiaBasica: 15.610, incrementoAnual: 2.377 },
  { min: 5.51, max: 5.75, cuantiaBasica: 14.880, incrementoAnual: 2.398 },
  { min: 5.76, max: 6, cuantiaBasica: 14.220, incrementoAnual: 2.416 },
  { min: 6.01, max: 6.01, cuantiaBasica: 13.620, incrementoAnual: 2.433 },
  { min: 6.02, max: Infinity, cuantiaBasica: 13.000, incrementoAnual: 2.450 }
]

//Manejo de errores
const mostrarError = (mensaje) => {
  erroresDiv.innerHTML = `<p>${mensaje}</p>`
  resultTable.style.display = 'none'
}

const limpiarErrores = () => {
  erroresDiv.innerHTML = ''
}

//Visualización
const ocultarFormulario = () => {
  document.getElementById('formulario').style.display = 'none'
}

const mostrarFormulario = () => {
  document.getElementById('formulario').style.display = 'block'
}

const ocultarResultado = () => {
  document.getElementById('resultado').style.display = 'none'
  resultTable.style.display = 'none'
  generarPDFButton.style.display = 'none'
  regresarButton.style.display = 'none'
}

const mostrarResultado = () => {
  document.getElementById('resultado').style.display = 'block'
  resultTable.style.display = 'table'
  generarPDFButton.style.display = 'inline-block'
  regresarButton.style.display = 'inline-block'
}

const regresar = () => {
  mostrarFormulario()
  ocultarResultado()
}

//Validar campos llenos
const actualizarVisibilidadBoton = () => {
  const inputsValidos = salPromedioInput.value && semCotizadasInput.value && edadInput.value
  calcularButton.style.display = inputsValidos ? 'inline-block' : 'none'
  resultTable.style.display = 'none'
}

//Validar salario mínimo
const validarSalarioMinimo = (salarioPromedio) => {
  if (salarioPromedio / 30 < salarioMinimoVigente) {
    mostrarError('El salario mensual no puede ser menor al salario mínimo')
    return false
  } else if (salarioPromedio > uma*25*30) {
    mostrarError('El tope de salario mensual son 25 UMA al mes')
    return false
  }
  return true
}

//Validar que las semanas y edad cumplan con la ley
const masQuinientas = (semCot, ed) => {
  let semanasCotizadasTotales = 0

  if (ed < 40) {
    mostrarError('La edad mínima admitida por el sistema son 40 años')
    return false
  } 
  if (ed > 100) {
    mostrarError('La edad máxima admitida por el sistema son 100 años')
    return false
  }

  if (ed >= 60) {
    semanasCotizadasTotales = semCot
  } else {
    const yearsTo = parseInt(60 - ed)
    semanasCotizadasTotales = semCot + (yearsTo * 52)
  }

  if (semanasCotizadasTotales < 500) {
    mostrarError('Para pensionarte es requisito mínimo 500 semanas cotizadas')
    return false
  } 
  if (semanasCotizadasTotales > 2600) {
    mostrarError('El máximo de semanas cotizadas admitidas por el sistema son 2600')
    return false
  }

  semanasCotizadasTotalesPDF = semanasCotizadasTotales
  return true
}

//Ubicar en tabulador
const rangoTabulador = (salProm) => {
  const salDiario = salProm / 30
  const vecesSalMin = (salDiario / salarioMinimoVigente).toFixed(2)

  const rangoEncontrado = tabulador.find((rango) => parseFloat(vecesSalMin) >= rango.min && parseFloat(vecesSalMin) <= rango.max)

  const cuantia = rangoEncontrado.cuantiaBasica
  const incrementos = rangoEncontrado.incrementoAnual
  cuantiaPDF = cuantia
  incrementosPDF = incrementos
  return { cuantia, incrementos }
}

//Lógica del cálculo
const calcularPension = (salProm, semCotTot, edoCiv, hij, cuant, increm) => {
  limpiarErrores()
  ocultarFormulario()
  
  const cuantiaMensual = (salProm * (cuant / 100))
  const numeroIncrementos = parseInt((semCotTot - 500) / 52)
  const cuantiaIncrementos = salProm * (increm / 100) * numeroIncrementos
  const sumaCuantias = cuantiaMensual + cuantiaIncrementos
  const asigConyugue = edoCiv === 0 ? 0 : sumaCuantias * 0.15
  const asigHijos = hij === 0 ? 0 : hij * 0.1 * sumaCuantias
  const ayudaAsistencial = sumaCuantias * 0.15
  const cuantiaTotal = sumaCuantias + asigConyugue + asigHijos + ayudaAsistencial

  resultBody.innerHTML = ''

  edadesPorcentajes.forEach((edad, index) => {
    const pension = cuantiaTotal * porcentajes[index]

    let pensionToShow

    if (pension > salProm) {
      pensionToShow = salProm
    } else if (pension < salarioMinimoVigente*30) {
      pensionToShow = salarioMinimoVigente*30
    } else {
      pensionToShow = pension
    }

    const fila = `<tr>
      <td>${edad}</td>
      <td>${(porcentajes[index] * 100) + '%'}</td>
      <td>${'$' + pensionToShow.toFixed(2)}</td>
    </tr>`
    resultBody.innerHTML += fila
  });

  mostrarResultado()

  cuantiaMensualPDF = cuantiaMensual
  numeroIncrementosPDF = numeroIncrementos
  cuantiaIncrementosPDF = cuantiaIncrementos
  sumaCuantiasPDF = sumaCuantias
  asigConyuguePDF = asigConyugue
  asigHijosPDF = asigHijos
  ayudaAsistencialPDF = ayudaAsistencial
  cuantiaTotalPDF = cuantiaTotal
}

const calcularButtonHandler = () => {
  limpiarErrores()

  const salarioPromedio = parseFloat(salPromedioInput.value)
  const semanasCotizadas = parseInt(semCotizadasInput.value)
  const edad = parseInt(edadInput.value)
  const estadoCivil = parseInt(document.getElementById('estadoCivil').value)
  const hijos = parseInt(document.getElementById('hijos').value)

  if (!validarSalarioMinimo(salarioPromedio)) {
    return
  }

  if (!masQuinientas(semanasCotizadas, edad)) {
    return
  }

  const semanasCotizadasTotales = semanasCotizadasTotalesPDF
  const { cuantia, incrementos } = rangoTabulador(salarioPromedio)
  calcularPension (salarioPromedio, semanasCotizadasTotales, estadoCivil, hijos, cuantia, incrementos)
}

const generarPDFButtonHandler = () => {
  const salPromedio = parseFloat(salPromedioInput.value)
  const semCotizadas = semCotizadasInput.value
  const edad = edadInput.value

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
    marginLeft: 15,
    marginRight: 15,
  })

  const xPos = (doc.internal.pageSize.width - resultTable.offsetWidth) / 2
  const maxTableWidth = doc.internal.pageSize.width - 30
  const finalTableWidth = resultTable.offsetWidth > maxTableWidth ? maxTableWidth : resultTable.offsetWidth

  const lineHeight = 10
  const x = 0
  const y = 0
  const width = doc.internal.pageSize.width
  const height = lineHeight * 1
  const fillColor = 'c8c8c8'
  doc.setFillColor(fillColor)
  doc.rect(x, y, width, height, "F")

  doc.setTextColor(33, 53, 71)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text('Proyección de pensión', doc.internal.pageSize.width / 2, height + 10, { align: 'center' })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Semanas cotizadas actuales: ${semCotizadas}`, 15, height + 20)
  doc.text(`Edad: ${edad}`, 15, height + 25)

  const dataNuevaTabla = [
    [ { content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' }}, { content: '$' + salarioMinimoVigente.toFixed(2), styles: { fontStyle: 'normal' }}, '', 'Cálculo Mensual' ],
    [ { content: 'Salario mensual promedio últimos 5 años:                        ', colSpan: 3 }, `${'$' + salPromedio.toFixed(2)}` ],
    [ { content: 'Porcentaje de Cuantía:', colSpan: 2}, `${cuantiaPDF + '%'}`, `${'$' + cuantiaMensualPDF.toFixed(2)}`],
    [ { content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${semanasCotizadasTotalesPDF}`, { content: '', rowSpan: 4 } ],
    [ 'Requisito:', '500' ],
    [ 'Excedentes:', `${semanasCotizadasTotalesPDF - 500}` ],
    [ { content: 'Incrementos por años excedentes:', colSpan: 2 }, `${numeroIncrementosPDF}` ],
    [ { content: 'Porcentaje de incremento:', colSpan: 2 }, `${incrementosPDF + '%'}`, `${'$' + cuantiaIncrementosPDF.toFixed(2)}` ],
    [ { content: 'Suma de cuantía e incrementos:                        ', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + sumaCuantiasPDF.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
    [ { content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${'$' + asigConyuguePDF.toFixed(2)}` ],
    [ 'Hijos:', '10% c/u', `${'$' + asigHijosPDF.toFixed(2)}` ],
    [ { content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${'$' + ayudaAsistencialPDF.toFixed(2)}` ],
    [ { content: 'Total de cuantía básica:                        ', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + cuantiaTotalPDF.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
  ]

const stylesPDF = {
  theme: 'grid',
  styles: {
    fontSize: 10,
    lineWidth: 0.1,
    cellPadding: 2,
    cellSpacing: 0,
    valign: 'middle',
    halign: 'center',
    fontStyle: 'normal',
    overflow: 'linebreak',
    fillColor: [255, 255, 255],
    textColor: [33, 53, 71],
    fillStyle: 'F',
  },
  headStyles: {
    fillColor: [200, 200, 200],
    fontStyle: 'bold',
  },
};

  doc.autoTable({
    head: [dataNuevaTabla[0]], 
    body: dataNuevaTabla.slice(1), 
    startX: xPos,
    startY: 40,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
    tableWidth: finalTableWidth,
  });

  doc.autoTable({
    html: '#resultTable',
    startX: xPos,
    startY: 150,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
    tableWidth: finalTableWidth,
  });

  const bottomRectHeight = lineHeight * 1
  const bottomRectY = doc.internal.pageSize.height - bottomRectHeight

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text('Consideraciones para la proyección', 15, bottomRectY - 32)

  doc.setFont("helvetica", "normal")
  doc.text('• Asignaciones familiares y ayuda asistencial, Artículo 164 LSS 1973', 15, bottomRectY - 25)
  doc.text('• Cuantía de las pensiones, Artículo 167 LSS 1973', 15, bottomRectY - 20)
  doc.text('• Pensión mínima, Artículo 168 LSS 1973', 15, bottomRectY - 15)
  doc.text('• Tope de pensión es el salario promedio, Artículo 169 LSS 1973', 15, bottomRectY - 10)
  doc.text('• Tope 25 umas, Transitorio Cuarto inciso II LSS 1973', 15, bottomRectY - 5)

  Set.fillColor = 'c8c8c8'
  doc.setFillColor(fillColor)
  doc.rect(x, bottomRectY, width, bottomRectHeight, "F")

  doc.save('Proyección.pdf')
  regresar()
};

//Manejadores de eventos
salPromedioInput.addEventListener('input', actualizarVisibilidadBoton)
semCotizadasInput.addEventListener('input', actualizarVisibilidadBoton)
edadInput.addEventListener('input', actualizarVisibilidadBoton)
calcularButton.addEventListener('click', calcularButtonHandler)
regresarButton.addEventListener('click', regresar)
generarPDFButton.addEventListener('click', generarPDFButtonHandler)