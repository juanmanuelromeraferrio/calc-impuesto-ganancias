"use strict";

var utils = require("./utils");
var defaults = require("lodash.defaults");
var flowRight = require("lodash.flowright");
var forEach = require("lodash.foreach");

var defaultValues = require("../data/values-2020.json");

var defaultOptions = {
  sueldoBruto: {
    default: 0,
    min: 0,
    max: null
  },
  alquiler: {
    default: 0,
    min: 0,
    max: null
  },
  creditoHipotecario: {
    default: 0,
    min: 0,
    max: null
  },
  cantHijos: {
    default: 0,
    min: 0,
    max: 8
  },
  isConyuje: {
    default: false
  },
  isJubilado: {
    default: false
  },
  isPatagonico: {
    default: false
  }
};

var clone = flowRight(
  JSON.parse,
  JSON.stringify
);

function CalcGanancias(values) {
  var self = this;

  // add missing parameters.
  values = defaults(clone(values || {}), defaultValues);
  self.values = values;
}

CalcGanancias.prototype.calculate = function calculate(options) {
  var self = this;

  // add missing parameters.
  options = defaults(clone(options || {}), defaultOptions);

  // prevent non desired values
  forEach(options, function(n, key) {
    var differentType = typeof n !== typeof defaultOptions[key].default;
    var hasRange = defaultOptions[key].min !== undefined;

    if (
      differentType ||
      (hasRange &&
        !utils.isInRange(n, defaultOptions[key].min, defaultOptions[key].max))
    ) {
      n = defaultOptions[key].default;
      options[key] = defaultOptions[key].default;
    }
  });

  var result = {};

  var deduccionAlquiler =
    getAnnualAmount(options.alquiler) * self.values.porcentajeAlquiler;
  if (deduccionAlquiler > self.values.topeAlquiler) {
    deduccionAlquiler = self.values.topeAlquiler;
  }

  var deduccionHipotecario = getAnnualAmount(options.creditoHipotecario);
  if (deduccionHipotecario > self.values.topeHipotecario) {
    deduccionHipotecario = self.values.topeHipotecario;
  }

  var aportes = getAportes(
    self.values,
    options.sueldoBruto,
    options.isJubilado
  );
  var sueldoNeto = options.sueldoBruto - aportes;
  var extras = sueldoNeto; //Aguinaldo + Bonos
  var ingresoAnual = getAnnualAmount(sueldoNeto) + extras;

  //Monto Aplicable a Ganancias
  var mni = self.values.minimoNoImponible + self.values.adicional4taCategoria;
  if (options.isPatagonico) {
    mni = mni * self.values.porcentajePatagonico;
  }

  var mniTotal =
    mni +
    self.values.coyuje * options.isConyuje +
    self.values.hijo * options.cantHijos +
    deduccionAlquiler +
    deduccionHipotecario;
  if (options.isJubilado) {
    mniTotal =
      self.values.topeJubilado + deduccionAlquiler + deduccionHipotecario;
  }

  var montoImponibleAplicable = 0;
  if (mniTotal < ingresoAnual) {
    montoImponibleAplicable = ingresoAnual - mniTotal;
  }

  var tax = calculateTax(self.values, montoImponibleAplicable);

  result.anualTax = tax.value.toFixed(2);
  result.monthlyTax = (result.anualTax / 13).toFixed(2);
  var taxRateNumber =
    0 == result.monthlyTax
      ? 0
      : (result.monthlyTax / options.sueldoBruto) * 100;
  result.taxRate = taxRateNumber.toFixed(2) + "%";
  result.marginalTaxRate =
    0 == taxRateNumber ? 0 : 100 * self.values.porcentajesEscales[tax.escala];
  result.marginalTaxRate = result.marginalTaxRate.toFixed(2) + "%";
  result.netBaseSalary =
    "" + Math.round(sueldoNeto - result.monthlyTax).toFixed(2);

  return result;
};

function getAportes(values, sueldoMensual, isJubilado) {
  var porcentajeAporte = isJubilado
    ? values.aportesJubilados
    : values.aportesNoJubilados;
  var aportes = porcentajeAporte * sueldoMensual;
  if (aportes > values.topeAportes) {
    aportes = values.topeAportes;
  }

  return aportes;
}

function getAnnualAmount(value) {
  return value * 12;
}

function calculateTax(values, amount) {
  var i = 0;
  var result = {};
  var value = 0;

  while (amount > values.topesEscalas[i]) {
    var diff =
      i == 0
        ? values.topesEscalas[i]
        : values.topesEscalas[i] - values.topesEscalas[i - 1];
    value += diff * values.porcentajesEscales[i];
    i++;
  }

  diff = i == 0 ? amount : amount - values.topesEscalas[i - 1];
  value += diff * values.porcentajesEscales[i];
  result.value = value;
  result.escala = i;

  return result;
}

module.exports = CalcGanancias;
