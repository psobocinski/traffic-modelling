'use strict';

const validators = {
  integer: input => Number.isInteger(parseFloat(input)) ? true : 'Must be an integer',
  number: input => Number.isNaN(parseFloat(input)) ? 'Must be a number' : true
};

function validateGreaterThanOrEqualTo(minimum, number) {
  if (parseFloat(number) < minimum)
    return `${number} must be greater than or equal to ${minimum}`;
}

function validateGreaterThan(minimum, number) {
  if (parseFloat(number) <= minimum)
    return `${number} must be greater than ${minimum}`;
}

class ConfigValidator {
  constructor(variablesConfig) {
    this.variablesConfig = variablesConfig;
  }

  validateSmallestValue(input, { independentVariable }) {
    const variableConfig = this.validationConfigFor(independentVariable);

    return validateGreaterThanOrEqualTo(variableConfig.minimum, input)
      || ConfigValidator.validatorFor(variableConfig)(input);
  }

  validateIncrement(input, { independentVariable }) {
    const variableConfig = this.validationConfigFor(independentVariable);

    return validateGreaterThan(0, input)
      || ConfigValidator.validatorFor(variableConfig)(input);
  }

  validationConfigFor(variableName) {
    return this.variablesConfig.find(({name}) => name === variableName);
  }

  validateNumberOfSimulations(input) {
    return validateGreaterThan(0, input)
      || validators.integer(input);
  }

  static validatorFor({ type }) {
    return validators[type];
  }
}

module.exports = ConfigValidator;
