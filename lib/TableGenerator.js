
const formatters = {
  header: {
    csv: row => row.join(','),
    markdown: row => `| ${row.join(' | ')} |\n| ${Array(row.length).fill('---').join(' | ')} |`,
  },
  row: {
    csv: row => row.join(','),
    markdown: row => `| ${row.join(' | ')} |`,

  },
};

class TableGenerator {
  constructor({ columns, format }) {
    this.headerFormatter = formatters.header[format];
    this.rowFormatter = formatters.row[format];
    this.rowHeaderLabels = columns.map(([, label]) => label);
  }

  generate(results) {
    const rows = results.map(result => this.rowFormatter(result));
    const rowHeaders = [this.headerFormatter(this.rowHeaderLabels)];

    return rowHeaders.concat(rows).join('\n');
  }
}

module.exports = TableGenerator;
