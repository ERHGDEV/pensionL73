import * as Constants from './constants'
import { mostrarError } from '../main.js'
 
//Validar salario mínimo
export const validarSalarioMinimo = (salarioPromedio) => {
    if (salarioPromedio / 30 < Constants.salarioMinimoVigente) {
      mostrarError('El salario mensual no puede ser menor al salario mínimo')
      return false
    } else if (salarioPromedio > Constants.uma*25*30) {
      mostrarError('El tope de salario mensual son 25 UMA al mes')
      return false
    }
    return true
}
  
//Validar que las semanas y edad cumplan con la ley
export const masQuinientas = (semCot, ed) => {
    let semanasCotizadasTotales = 0
    let errorMessage = ''
  
    if (ed < 40) {
      errorMessage = 'La edad mínima admitida por el sistema son 40 años'
    } else if (ed > 100) {
      errorMessage = 'La edad máxima admitida por el sistema son 100 años'
    }

    if (ed >= 60) {
        semanasCotizadasTotales = semCot
    } else {
        const yearsTo = parseInt(60 - ed)
        semanasCotizadasTotales = semCot + (yearsTo * 52)
    }
    
  
    if (semanasCotizadasTotales < 500) {
      errorMessage = 'Para pensionarte es requisito mínimo 500 semanas cotizadas'
    } 
    if (semanasCotizadasTotales > 2600) {
      errorMessage = 'El máximo de semanas cotizadas admitidas por el sistema son 2600'
    }

    return { value: semanasCotizadasTotales, error: errorMessage }
}
  
//Ubicar en tabulador
export const rangoTabulador = (salProm) => {
    const salDiario = salProm / 30
    const vecesSalMin = (salDiario / Constants.salarioMinimoVigente).toFixed(2)
  
    const rangoEncontrado = Constants.tabulador.find((rango) => parseFloat(vecesSalMin) >= rango.min && parseFloat(vecesSalMin) <= rango.max)
  
    const cuantia = rangoEncontrado.cuantiaBasica
    const incrementos = rangoEncontrado.incrementoAnual
    return { cuantia, incrementos }
}