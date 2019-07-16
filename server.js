'use strict';

const fs = require('fs'),
  commonConfig = require('./config/common'),
  simulationsConfig = require('./config/simulations'),
  ArrivalSequence = require('./lib/ArrivalSequence'),
  Simulation = require('./lib/Simulation');

let arrivalSequence, config, simulation, simulations = [], simulationResults, table;

const rowHeaderLabels = [
  'Min Time in Lane',
  'Time Saved %',
  'Avg Time',
  'Cars Remain',
  'Aggregate Time',
  'Aggregate Throughput (cars / 100 ticks)',
];

const rowHeaderFormatters = {
  csv: row => row.join(','),
  markdown: row => `| ${row.join(' | ')} |\n| ${new Array(row.length).fill('---').join(' | ')} |`
};


const rowFormatters = {
  csv: row => row.join(','),
  markdown: row => `| ${row.join(' | ')} |`
};

function generateTable(results, format) {
  const rowHeaderFormatter = rowHeaderFormatters[format],
    rowFormatter = rowFormatters[format];
  let rows, rowHeaders;

  rows = results.map(result => rowFormatter(result));
  rowHeaders = [rowHeaderFormatter(rowHeaderLabels)];

  return rowHeaders.concat(rows).join('\n');
}

function createOutputFile({ outputPath, outputFormat }, results) {
  const fileName = `results.${outputFormat}`,
    pathAndFileName = `${outputPath}/${fileName}`;

  fs.writeFile(pathAndFileName, `${results}\n`, function(err) {
    if(err) return console.log(err);

    console.log(`results outputted to file: ${pathAndFileName}`);
  });
}

arrivalSequence = (new ArrivalSequence(commonConfig)).generate();

simulationsConfig.forEach(simulationConfig => {
  config = Object.assign({}, commonConfig, simulationConfig);
  simulation = new Simulation(config, arrivalSequence);
  simulations.push(simulation);
});

simulations[0].metricsCalculator.printCommonMetrics();

simulationResults = simulations.map(simulation =>
  simulation.run());

table = generateTable(simulationResults, commonConfig.outputFormat);

createOutputFile(commonConfig, table);
