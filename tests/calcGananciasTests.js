'use strict';

var expect = require('chai').expect;
var CalcGanancias = require('../index');

describe('#CalcGanancias.calculate', function () {
    it('should return no taxes if salary is 0', function () {

        var options = {
            sueldoBruto: 0,
            alquiler: 0,
            creditoHipotecario: 0,
            cantHijos: 0,
            isConyuje: false,
            isJubilado: false,
            isPatagonico: false
        }

        var calcGanancias = new CalcGanancias();
        var result = calcGanancias.calculate(options);

        expect(result.anualTax).to.equal("0.00");
        expect(result.monthlyTax).to.equal("0.00");
        expect(result.taxRate).to.equal("0.00%");
        expect(result.marginalTaxRate).to.equal("0%");
        expect(result.netBaseSalary).to.equal(0);
    });

    it('should return no taxes if salary is 10000 and net salary has to be 8300', function () {

        var options = {
            sueldoBruto: 10000,
            alquiler: 0,
            creditoHipotecario: 0,
            cantHijos: 0,
            isConyuje: false,
            isJubilado: false,
            isPatagonico: false
        }

        var calcGanancias = new CalcGanancias();
        var result = calcGanancias.calculate(options);

        expect(result.anualTax).to.equal("0.00");
        expect(result.monthlyTax).to.equal("0.00");
        expect(result.taxRate).to.equal("0.00%");
        expect(result.marginalTaxRate).to.equal("0%");
        expect(result.netBaseSalary).to.equal(8300);
    });

    it('should return no taxes if salary is 10000 and net salary has to be 9400 if is jubilado', function () {

        var options = {
            sueldoBruto: 10000,
            alquiler: 0,
            creditoHipotecario: 0,
            cantHijos: 0,
            isConyuje: false,
            isJubilado: true,
            isPatagonico: false
        }

        var calcGanancias = new CalcGanancias();
        var result = calcGanancias.calculate(options);

        expect(result.anualTax).to.equal("0.00");
        expect(result.monthlyTax).to.equal("0.00");
        expect(result.taxRate).to.equal("0.00%");
        expect(result.marginalTaxRate).to.equal("0%");
        expect(result.netBaseSalary).to.equal(9400);
    });

});