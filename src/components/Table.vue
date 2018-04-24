<script>
import Vue from 'vue'
import DateHelpers from '../dates'

const TableRow = Vue.component('TableRow', {
  props: ['selected', 'config', 'clickHandler', 'row'],
  computed: {
    rowClass: function() {
      return this.selected ? "selected" : ""
    },
  },
  methods: {
    formatLabel: function (value, klass) {
      return "<span class=\"label label-" + klass + "\">" + value + "</span>";
    },
    formatDatetimeLabel: function (value) {
      const date = new Date(value);
      const today = new Date();
      const tmrw = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      if ((date.getMonth() === today.getMonth()) &&
          (date.getDate() === today.getDate())) {
        return this.formatLabel("Today " + DateHelpers.formatTime(date), "warning");
      } else if ((date.getMonth() === tmrw.getMonth()) &&
        (date.getDate() === tmrw.getDate())) {
        return this.formatLabel("Tomorrow", "info");
      } else {
        return DateHelpers.formatDate(date);
      }
    },
    formatDatetime: function (value) {
      const date = new Date(value);
      const today = new Date();
      if ((date.getMonth() === today.getMonth()) &&
          (date.getDate() === today.getDate())) {
        return DateHelpers.formatTime(date);
      } else {
        return DateHelpers.formatDate(date);
      }
    },
    formatPrice: function (value) {
      if (value < 10) {
        return value.toFixed(2);
      } else if (value < 100) {
        return value.toFixed(1);
      } else {
        return value.toFixed(0);
      }
    },
    formatAmount: function (value) {
      const absValue = Math.abs(value);
      if (absValue < 1000) {
        return Math.floor(value);
      } else if (absValue < 10000) {
        return (value / 1000).toFixed(1) + "K";
      } else {
        return Math.floor((value / 1000)) + "K";
      }
    },
    formatFloat: function (value, dp) {
      return value.toFixed(dp);
    },
    formatPct: function (value, dp) {
      return (100 * value).toFixed(dp) + "%";
    },
    formatValue: function (col, row) {
      const value = row[col.name];
      if (value === undefined) {
        return undefined;
      } else if (col.format === "datetime_label") {
        return this.formatDatetimeLabel(value);
      } else if (col.format === "datetime") {
        return this.formatDatetime(value);
      } else if (col.format === "price") {
        return this.formatPrice(value);
      } else if (col.format === "amount") {
        return this.formatAmount(value);
      } else if (col.format === "float1") {
        return this.formatFloat(value, 1);
      } else if (col.format === "float2") {
        return this.formatFloat(value, 2);
      } else if (col.format === "float3") {
        return this.formatFloat(value, 3);
      } else if (col.format === "pct1") {
        return this.formatPct(value, 1);
      } else if (col.format === "pct2") {
        return this.formatPct(value, 2);
      } else if (col.format === "pct3") {
        return this.formatPct(value, 3);
      } else {
        return value;
      }
    },
    colClass: function(col) {
      return `text-center ${(col.muted ? "text-muted" : "")}`
    },
    cellValue: function(col) {
      return this.formatValue(col, this.row)
    }
  },
  template: `
    <tr v-bind:class="rowClass">
      <td v-for="col in config" v-bind:class="colClass(col)" @click="clickHandler(col, row)">
        {{ cellValue(col) }}
      </td>
    </tr>
  `
})

const Table = Vue.component('Table', {
  props: ['config', 'rows', 'sortHandler'],
  data() {
    return {
      selectedName: ''
    }
  },
  components: { TableRow },
  methods: {
    handleRowSelected: function (col, row) {
      this.selectedRow = row;
      this.$forceUpdate()
    },
    isSelected: function (row) {
      if (this.selectedRow === undefined) {
        return false
      }
      return row.key === this.selectedRow.key;
    },
    altKey: function (key) {
      return `${key}-${Math.random()}`
    },
  },
  template: `
    <table class="table table-striped table-condensed table-bordered">
      <thead>
        <tr>
          <th v-for="item in config" class="text-center" @click="sortHandler(item)">
            {{ item.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TableRow
          v-for="row in rows"
          :key="altKey(row.key)"
          v-bind:config="config"
          v-bind:clickHandler="handleRowSelected"
          v-bind:selected="isSelected(row)"
          v-bind:selectedName="selectedName"
          v-bind:row="row"
        ></TableRow>
      </tbody>
    </table>
  `
})

const TablePaginator = Vue.component('TablePaginator', {
  props: ['rows', 'nRows', 'i', 'clickHandler'],
  methods: {
    initCells: function (rows, nRows) {
      let n = Math.floor(rows.length / nRows);
      if (0 !== rows.length % nRows) {
        n += 1;
      }
      const items = [];
      for (let i = 0; i < n; i++) {
        const item = {
          value: i,
          label: i + 1
        }
        items.push(item);
      }
      return items;
    },
    activeCell: function (item) {
      const active = item.value === this.i
      return `page-item ${active ? 'active' : ''}`
    }
  },
  computed: {
    cells: function() {
      return this.initCells(this.rows, this.nRows)
    },
  },
  template: `
    <ul class="pagination">
      <li v-for="item in cells" v-bind:class="activeCell(item)" @click="clickHandler(item)">
        <a class="page-link">{{ item.label }}</a>
      </li>
    </ul>
  `
});

export default {
  props: ['config', 'rows', 'nRows'],
  data() {
    return {
      currentPage: 0,
      sortAttr: undefined,
      sortPolarity: false
    }
  },
  components: { Table, TablePaginator },
  computed: {
    filteredRows: function () {
      return this.filterRows(this.currentPage, this.sortRows(this.rows))
    }
  },
  watch: {
    'rows':{
      handler: function (val, oldVal) {
        if (val.length !== oldVal.length) {
          this.currentPage = 0;
          this.sortAttr = undefined;
          this.sortPolarity = false;
        }
      },
      deep: true
    }
  },
  methods: {
    tableSorter: function (item0, item1) {
      const value0 = item0[this.sortAttr];
      const value1 = item1[this.sortAttr];
      const polarity = this.sortPolarity ? 1 : -1;
      if (value0 < value1) {
        return -polarity;
      } else if (value0 > value1) {
        return polarity;
      } else {
        return 0;
      }
    },
    sortRows: function (rows) {
      if (this.sortAttr === undefined) {
        return rows;
      } else {
        return rows.sort(this.tableSorter);
      }
    },
    filterRows: function (currentPage, rows) {
      const i = currentPage * this.nRows;
      const j = (currentPage + 1) * this.nRows;
      return rows.slice(i, j);
    },
    handlePaginatorClicked: function (item) {
      this.currentPage = item.value;
    },
    handleSorterClicked: function (item) {
      this.sortAttr = item.name;
      this.sortPolarity = !this.sortPolarity;
    },
  },
  template: `
    <div>
      <Table v-bind:config="config" v-bind:rows="filteredRows" v-bind:sortHandler="handleSorterClicked">
      </Table>
      <TablePaginator
        v-if="rows.length > nRows"
        v-bind:rows="rows"
        v-bind:nRows="nRows"
        v-bind:i="currentPage"
        v-bind:clickHandler="handlePaginatorClicked"
      ></TablePaginator>
    </div>
  `
};

</script>