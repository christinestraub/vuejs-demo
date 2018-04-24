<template>
  <div class="text-center" style="margin-top: 80px">
    <ul class="nav nav-tabs">
      <li v-for="tab in Tabs"
          v-bind:class="tabClass(tab)"
          @click="handleTabClicked(tab)">
        <a>{{ tab.label }}</a>
      </li>
    </ul>
    <div style="margin-top: 20px">
      <TableWrapper
        v-bind:config="TableConfig[selectedTab]"
        v-bind:rows="rows"
        v-bind:nRows="20">
      </TableWrapper>
    </div>
  </div>
</template>

<style>

</style>

<script>
import TableWrapper from './Table.vue'
import eng_1_fixtures from '../../fixtures/ENG~1~fixtures.json'
import eng_1_outrights from '../../fixtures/ENG~1~outrights.json'
import eng_1_teams from '../../fixtures/ENG~1~teams.json'
import eng_2_fixtures from '../../fixtures/ENG~2~fixtures.json'
import eng_2_outrights from '../../fixtures/ENG~2~outrights.json'
import eng_2_teams from '../../fixtures/ENG~2~teams.json'
import fra_1_fixtures from '../../fixtures/FRA~1~fixtures.json'
import fra_1_outrights from '../../fixtures/FRA~1~outrights.json'
import fra_1_teams from '../../fixtures/FRA~1~teams.json'
import ger_1_fixtures from '../../fixtures/GER~1~fixtures.json'
import ger_1_outrights from '../../fixtures/GER~1~outrights.json'
import ger_1_teams from '../../fixtures/GER~1~teams.json'
import spa_1_fixtures from '../../fixtures/SPA~1~fixtures.json'
import spa_1_outrights from '../../fixtures/SPA~1~outrights.json'
import spa_1_teams from '../../fixtures/SPA~1~teams.json'

const fixtures = {
  'ENG~1~fixtures.json': eng_1_fixtures,
  'ENG~1~outrights.json': eng_1_outrights,
  'ENG~1~teams.json': eng_1_teams,
  'ENG~2~fixtures.json': eng_2_fixtures,
  'ENG~2~outrights.json': eng_2_outrights,
  'ENG~2~teams.json': eng_2_teams,
  'FRA~1~fixtures.json': fra_1_fixtures,
  'FRA~1~outrights.json': fra_1_outrights,
  'FRA~1~teams.json': fra_1_teams,
  'GER~1~fixtures.json': ger_1_fixtures,
  'GER~1~outrights.json': ger_1_outrights,
  'GER~1~teams.json': ger_1_teams,
  'SPA~1~fixtures.json': spa_1_fixtures,
  'SPA~1~outrights.json': spa_1_outrights,
  'SPA~1~teams.json': spa_1_teams,
}

const Tabs = [
  {
    name: "teams",
    label: "Teams"
  },
  {
    name: "fixtures",
    label: "Fixtures"
  },
  {
    name: "outrights",
    label: "Outrights"
  }
];

const TableConfig = {
  teams: [
    {
      name: "name",
      label: "Team"
    },
    {
      name: "points",
      label: "Points"
    },
    {
      name: "goal_difference",
      label: "Goal Diff"
    },
    {
      name: "played",
      label: "Played"
    },
    {
      name: "expected_season_points",
      label: "Exp Season Pts",
      format: "float2"
    },
    {
      name: "ppg_rating",
      label: "PPG Rating",
      format: "float3"
    }
  ],
  fixtures: [
    {
      name: "kickoff",
      label: "Kickoff",
      format: "datetime"
    },
    {
      name: "name",
      label: "Event"
    },
    {
      name: "price_1",
      label: "[1]",
      format: "price"
    },
    {
      name: "price_X",
      label: "[X]",
      format: "price"
    },
    {
      name: "price_2",
      label: "[2]",
      format: "price"
    }
  ],
  outrights: [
    {
      name: "market",
      label: "Market"
    },
    {
      name: "team",
      label: "Team"
    },
    {
      name: "price",
      label: "Price",
      format: "price"
    }
  ]
};

export default {
  name: 'Dash',
  props: ['apiProxy', 'leaguename'],
  data () {
    return {
      selectedTab: "teams",
      rows: [],
      Tabs,
      TableConfig,
    }
  },
  components: { TableWrapper },
  beforeMount: function() {
    this.fetchData(this.leaguename, this.selectedTab);
  },
  watch: {
    'leaguename': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.fetchData(val, this.selectedTab);
        }
      },
      deep: true
    }
  },
  methods: {
    tabClass: function(tab) {
      return (tab.name === this.selectedTab) ? 'active' : ''
    },
    fetchData: function (leaguename, attr) {
      /*
      const path = "/fixtures/" + leaguename.replace(".", "~") + "~" + attr + ".json";
      this.apiProxy.httpGetJSON(path, function (rows) {
        // console.log(JSON.stringify(rows));
        this.rows = rows;
      }.bind(this));
      */
      const path = leaguename.replace(".", "~") + "~" + attr + ".json";
      this.rows = fixtures[path]
    },
    handleTabClicked: function (tab) {
      // update state
      this.selectedTab = tab.name;
      // fetch data
      this.fetchData(this.leaguename, tab.name);
    },
  }
}
</script>

<style>
</style>
