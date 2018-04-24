<template>
  <div id="app">
    <div class="container-fluid">
      <Nav title="Upwork UI demo"
           v-bind:leagues="leagues"
           v-bind:username="username"
           v-bind:leaguename="leaguename"
           v-bind:loginHandler="handleLogin"
           v-bind:leagueHandler="handleLeagueChanged"
           v-bind:logoutHandler="handleLogout">
      </Nav>
      <Dash v-if="leaguename && username"
            v-bind:leaguename="leaguename"
            v-bind:apiProxy="apiProxy">
      </Dash>
    </div>
  </div>
</template>

<script>
import UpworkAPIProxy from './services';
import Nav from './components/Nav.vue'
import Dash from './components/Dash.vue'
import users from '../fixtures/users.json'
import leagues from '../fixtures/leagues.json'

const CookieName = "upwork-ui";
const AjaxErrHandler = function(xhr, ajaxOptions, thrownError) {
    if (xhr.status === 400) {
	  Alert.warning(xhr.responseText);
    } else {
	  console.log(xhr.status+" -> "+xhr.responseText);
    }
};

export default {
  name: 'app',
  data () {
    return {
	    leagues: [],
	    users: [],
	    apiProxy: new UpworkAPIProxy(AjaxErrHandler, false),
	    username: this.$cookie.get(CookieName),
        leaguename: ''
    }
  },
  components: { Nav, Dash },
  created: function () {
    // load users
    // this.apiProxy.httpGetJSON("/fixtures/users.json", function (users) {
      // console.log(JSON.stringify(users));
      this.users = users;
    // }.bind(this));
    // load leagues
    // this.apiProxy.httpGetJSON("/fixtures/leagues.json", function (leagues) {
      // console.log(JSON.stringify(leagues));
      this.leagues = leagues;
      this.leaguename = leagues[0].name;
    // }.bind(this));
  },
  methods: {
    handleLogin: function (username, password) {
      const matchedUsers = this.users.filter(function (user) {
        return (user.name === username) && (user.password === password);
      });
      if (matchedUsers.length > 0) {
        // update username
        this.username = (matchedUsers.length !== 0) ? matchedUsers[0].name : undefined;
        // update cookie
        this.$cookie.set(CookieName, this.username);
      }
    },
    handleLeagueChanged: function (leaguename) {
      this.leaguename = leaguename
    },
    handleLogout: function () {
      this.username = undefined
      // reset cookie
      this.$cookie.delete(CookieName);
    },
  }
}
</script>
