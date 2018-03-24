Calculadora Impuesto a las Ganancias Argentina
=========

Biblioteca que permite calcular cuanto es el monto retenido por el impuesto a las ganancias.

## Install

    npm install calc-impuesto-ganancias

## Usage

```js
var CalcGanancias = require('calc-impuesto-ganancias');

var options = {
    sueldoBruto: 4000,
    alquiler: 0,
    creditoHipotecario: 0,
    cantHijos: 0,
    isConyuje: false,
    isJubilado: false,
    isPatagonico: false
}

var calcGanancias = new CalcGanancias();
calcGanancias.calculate(options);

//Should be return

var result = {
    anualTax: '2880.85',
    monthlyTax: '240.07',
    taxRate: '0.60%',
    marginalTaxRate: '9,00%',
    netBaseSalary: 32960
};


```
    
## Tests

  `npm test`

## MIT Licenced