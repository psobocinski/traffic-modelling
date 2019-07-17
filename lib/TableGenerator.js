'use strict';

const rowHeaderLabels = [
  'Min Time in Lane',
  'Time Saved %',
  'Avg Time',
  'Cars Remain',
  'Aggregate Time',
  'Aggregate Throughput (cars / 100 ticks)',
];

const formatters = {
  header: {
    csv: row => row.join(','),
    markdown: row => `| ${row.join(' | ')} |\n| ${new Array(row.length).fill('---').join(' | ')} |`
  },
  row: {
    csv: row => row.join(','),
    markdown: row => `| ${row.join(' | ')} |`

  }
};

class TableGenerator {
  constructor(format) {
    this.headerFormatter = formatters.header[format];
    this.rowFormatter = formatters.row[format];
  }

  generate(results) {
    let rows = results.map(result => this.rowFormatter(result)),
      rowHeaders = [this.headerFormatter(rowHeaderLabels)];

    return rowHeaders.concat(rows).join('\n');
  }
}

module.exports = TableGenerator;
