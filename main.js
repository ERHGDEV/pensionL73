import jsPDF from "jspdf"
import 'jspdf-autotable'
import './style.css'
import * as Constants from './sources/constants'
import { validarSalarioMinimo, masQuinientas, rangoTabulador } from './sources/validation'

document.querySelector('#app').innerHTML = `
  <div id="container">
    
    <h1>Calculadora de pensión</h1>
    
    <h2>Trabajador IMSS ley 73</h2>
    
    <section id="formulario"> 
      <br>
      <label>Ingresa los siguientes datos:</label><br><br>
      
      <table id="formularioDatos">
        <tr>
          <td>Salario mensual:</td>
          <td><input type="number" id="salPromedio" placeholder="Promedio últimos 5 años" min="7467.91"></td>
        </tr>
        <tr>
          <td>Semanas cotizadas:</td>
          <td><input type="number" id="semCotizadas" min="0"></td>
        </tr>
        <tr>
          <td>Edad:</td>
          <td><input type="number" id="edad" min="40"></td>
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

//DOM
const salPromedioInput = document.getElementById('salPromedio')
const semCotizadasInput = document.getElementById('semCotizadas')
const edadInput = document.getElementById('edad')
const erroresDiv = document.getElementById('errores')
const resultTable = document.getElementById('resultTable')
const resultBody = document.getElementById('resultBody')
const generarPDFButton = document.getElementById('generarPDF')
const calcularButton = document.getElementById('calc')
const regresarButton = document.getElementById('regresar')

//Validar campos llenos
const actualizarVisibilidadBoton = () => {
  const inputsValidos = salPromedioInput.value && semCotizadasInput.value && edadInput.value
  calcularButton.style.display = inputsValidos ? 'inline-block' : 'none'
  resultTable.style.display = 'none'
}

//Variables para imprimir en el pdf
let semanasCotizadasTotalesPDF, cuantiaPDF, incrementosPDF, cuantiaMensualPDF, numeroIncrementosPDF, cuantiaIncrementosPDF, sumaCuantiasPDF, asigConyuguePDF, asigHijosPDF, ayudaAsistencialPDF, cuantiaTotalPDF

//Manejo de errores
export const mostrarError = (mensaje) => {
  erroresDiv.innerHTML = `<p>${mensaje}</p>`
  resultTable.style.display = 'none'
}

const limpiarErrores = () => {
  erroresDiv.innerHTML = ''
}

//Visualización
const ocultarFormulario = () => {
  const formulario = document.getElementById('formulario');
  formulario.style.opacity = '0'
  setTimeout(() => {
    formulario.style.display = 'none'
  }, 0)
}

const mostrarFormulario = () => {
  const formulario = document.getElementById('formulario');
  formulario.style.display = 'block'
  setTimeout(() => {
    formulario.style.opacity = '1'
  }, 0)
}

const ocultarResultado = () => {
  const resultado = document.getElementById('resultado');
  resultado.style.opacity = '0'
  setTimeout(() => {
    resultado.style.display = 'none'
    resultTable.style.display = 'none'
    generarPDFButton.style.display = 'none'
    regresarButton.style.display = 'none'
  }, 0)
}

const mostrarResultado = () => {
  const resultado = document.getElementById('resultado');
  resultado.style.opacity = '0'
  resultado.style.display = 'block'
  setTimeout(() => {
    resultado.style.opacity = '1';
    resultTable.style.display = 'table'
    generarPDFButton.style.display = 'inline-block'
    regresarButton.style.display = 'inline-block'
  }, 0)
}

const regresar = () => {
  mostrarFormulario()
  ocultarResultado()
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

  Constants.edadesPorcentajes.forEach((edad, index) => {
    const pension = cuantiaTotal * Constants.porcentajes[index]

    let pensionToShow

    if (pension > salProm) {
      pensionToShow = salProm
    } else if (pension < Constants.salarioMinimoVigente*30) {
      pensionToShow = Constants.salarioMinimoVigente*30
    } else {
      pensionToShow = pension
    }

    const fila = `<tr>
      <td>${edad}</td>
      <td>${(Constants.porcentajes[index] * 100) + '%'}</td>
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

  //DOM
  const salarioPromedio = parseFloat(salPromedioInput.value)
  const semanasCotizadas = parseInt(semCotizadasInput.value)
  const edad = parseInt(edadInput.value)
  const estadoCivil = parseInt(document.getElementById('estadoCivil').value)
  const hijos = parseInt(document.getElementById('hijos').value)

  if (!validarSalarioMinimo(salarioPromedio)) {
    return
  }

  const { value: semanasCotizadasTotales, error: errorMessage } = masQuinientas(semanasCotizadas, edad)
  
  if (errorMessage) {
    mostrarError(errorMessage)
    return
  }

  const { cuantia, incrementos } = rangoTabulador(salarioPromedio)

  semanasCotizadasTotalesPDF = semanasCotizadasTotales
  cuantiaPDF = cuantia
  incrementosPDF = incrementos

  calcularPension (salarioPromedio, semanasCotizadasTotales, estadoCivil, hijos, cuantia, incrementos)
}

//Fecha para el PDF
const getFormattedDate = () => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear().toString().slice(2)
  return `${day}/${month}/${year}`
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
  const currentDate = getFormattedDate()
  doc.text(`${currentDate}`, doc.internal.pageSize.width - 17, 15, { align: 'right' })
  doc.text(`Semanas cotizadas actuales: ${semCotizadas}`, 15, height + 20)
  doc.text(`Edad: ${edad}`, 15, height + 25)

  const dataNuevaTabla = [
    [ { content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' }}, { content: '$' + Constants.salarioMinimoVigente.toFixed(2), styles: { fontStyle: 'normal' }}, '', 'Cálculo Mensual' ],
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
}

  doc.autoTable({
    head: [dataNuevaTabla[0]], 
    body: dataNuevaTabla.slice(1), 
    startX: xPos,
    startY: 40,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
    tableWidth: finalTableWidth,
  })

  doc.autoTable({
    html: '#resultTable',
    startX: xPos,
    startY: 150,
    theme: stylesPDF.theme,
    styles: stylesPDF.styles,
    headStyles: stylesPDF.headStyles,
    tableWidth: finalTableWidth,
  })

  const bottomRectHeight = lineHeight * 1
  const bottomRectY = doc.internal.pageSize.height - bottomRectHeight

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text('Consideraciones para la proyección', 15, bottomRectY - 37)

  doc.setFont("helvetica", "normal")
  doc.text('• Este cálculo únicamente es una proyección, el IMSS realizará el cálculo final al momento del trámite.', 15, bottomRectY - 30)
  doc.text('• Asignaciones familiares y ayuda asistencial, Artículo 164 LSS 1973.', 15, bottomRectY - 25)
  doc.text('• Cuantía de las pensiones, Artículo 167 LSS 1973.', 15, bottomRectY - 20)
  doc.text('• Pensión mínima, Artículo 168 LSS 1973.', 15, bottomRectY - 15)
  doc.text('• Tope de pensión es el salario promedio, Artículo 169 LSS 1973.', 15, bottomRectY - 10)
  doc.text('• Tope 25 umas, Transitorio Cuarto inciso II LSS 1973.', 15, bottomRectY - 5)

  Set.fillColor = 'c8c8c8'
  doc.setFillColor(fillColor)
  doc.rect(x, bottomRectY, width, bottomRectHeight, "F")

  doc.setTextColor(255, 255, 255)
  doc.text('ERHGDEV 2024©',doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 3, { align: 'center' })

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