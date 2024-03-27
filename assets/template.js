export const template =  `
    <div id= "aplication">
        <header> 
            <h1>Calculadora de pensión</h1>
            <h2>Trabajador IMSS Ley 97</h2>
        </header>

        <section id="sectionLanding">
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

                <button id="goToCalculadora">Ir a calculadora</button>
            </div>
        </section>

        <section id="sectionFormulario">
            <div class="container">
                <p>Ingresa los siguientes datos:</p>

                <div class="box">
                    <div class="input__wrapper">
                        <input 
                            id="password" 
                            type="number" 
                            name="password" 
                            placeholder="Salario promedio" 
                            title="Minimum 6 characters at least 1 Alphabet and 1 Number" 
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required class="input__field"
                        >
                        <label for="password" class="input__label">
                            Salario mensual
                        </label>
                    </div>
                </div>

                <div class="box">
                    <div class="input__wrapper">
                        <input 
                            id="password" 
                            type="number" 
                            name="password" 
                            placeholder="Salario promedio" 
                            title="Minimum 6 characters at least 1 Alphabet and 1 Number" 
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required class="input__field"
                        >
                        <label for="password" class="input__label">
                            Semanas cotizadas
                        </label>
                    </div>
                </div>

                <div class="box">
                    <div class="input__wrapper">
                        <input 
                            id="password" 
                            type="number" 
                            name="password" 
                            placeholder="Salario promedio" 
                            title="Minimum 6 characters at least 1 Alphabet and 1 Number" 
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required class="input__field"
                        >
                        <label for="password" class="input__label">
                            Edad
                        </label>
                    </div>
                </div>

                <table id="formularioDatos">
                    <tr>
                        <td>Estado civil:</td>
                        <td><select name="estadoCivil" id="estadoCivil">
                            <option value="0">Solter@</option>
                            <option value="1">Casad@</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td>Hijos:</td>
                        <td><select name="hijos" id="hijos">
                            <option value="0">No</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select></td>
                    </tr>
                </table>

                <button id="calc";">Calcular</button>
            </div>
        </section>

        <section id="sectionResultado">
            <div class="container">
                <button id="regresar">Regresar</button>
                <table id="resultTable">
                    <thead>
                        <tr>
                        <th>Edad de pensión</th>
                        <th>Porcentaje</th>
                        <th>Pensión Mensual</th>
                        </tr>
                    </thead>
                    <tbody id="resultBody"></tbody>
                </table>
                <button id="generarPDF">Generar PDF</button>
            </div>
        </section>

        

        <footer>ERHGDEV 2024©</footer>
    </div>
`