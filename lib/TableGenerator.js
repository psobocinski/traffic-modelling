'use strict';

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
  constructor({ columns, format }) {
    this.headerFormatter = formatters.header[format];
    this.rowFormatter = formatters.row[format];
    this.rowHeaderLabels = columns.map(([_metric, label]) => label);
  }

  generate(results) {
    let rows = results.map(result => this.rowFormatter(result)),
      rowHeaders = [this.headerFormatter(this.rowHeaderLabels)];

    return rowHeaders.concat(rows).join('\n');
  }
}

module.exports = TableGenerator;
