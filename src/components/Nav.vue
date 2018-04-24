<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button class="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false"
                    aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand">{{ title }}</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul v-if="username" class="nav navbar-nav navbar-right">
                <li style="margin-right: 3px">
                    <a>League</a>
                </li>
                <li style="margin-top: 7px">
                    <select v-model="leaguename" class="form-control">
                        <option v-for="league in leagues"
                                v-bind:value="league.name">
                            {{ league.name }}
                        </option>
                    </select>
                </li>
                <li @click="handleLogout">
                    <a>Logout</a>
                </li>
            </ul>
            <div v-if="username" id="message" class="div-username">
                Hello {{ username }} :)
            </div>
            <ul v-if="!username" class="nav navbar-nav navbar-right list-inline">
                <li><label style="margin-top: 17px">Username</label></li>
                <li><input id="username" type="text" class="form-control" style="margin-top: 7px" /></li>
                <li><label style="margin-top: 17px">Password</label></li>
                <li><input id="password" type="text" class="form-control" style="margin-top: 7px" /></li>
                <li><button class="btn btn-default btn-login" @click="handleLogin">Login</button></li>
            </ul>
        </div>
    </div>
  </nav>
</template>

<style>
.btn-login {
    margin-top: 7px;
    margin-right: 5px
}

.div-username {
    position: fixed;
    top: 0;
    right: 250px;
    z-index: 9999;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 12px;
}
</style>

<script>
export default {
  name: 'Nav',
  props: ['title', 'leaguename', 'leagues', 'username', 'loginHandler', 'logoutHandler', 'leagueHandler'],
  watch: {
    'leaguename': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.leagueHandler(val);
        }
      },
      deep: true
    }
  },
  methods: {
    handleLogout: function() {
        this.logoutHandler();
    },
    handleLogin: function () {
      const username = $("#username").val();
      const password = $("#password").val();
      if ((username !== '') && (password !== '')) {
        this.loginHandler(username, password);
      }
    },
  },
}
</script>
