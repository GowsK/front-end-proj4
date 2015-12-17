angular
  .module('space_shooter')
  .controller('usersController', UserController)

UserController.$inject = ['User', 'TokenService', '$scope', '$rootScope'];
function UserController(User, TokenService, $scope, $rootScope) {
  var self = this;

  self.all = [];
  self.user = {};

  self.initialized = false;

  $rootScope.$on('$viewContentLoaded', function(event, viewConfig) {
    if(document.getElementsByTagName('canvas').length > 0 && self.initialized === false) {
      initializeStartScreen();
      initializeGameZone();
      self.initialized = true;
    }
  });

  $(window).on('myCustomEvent', function(e, data) {
    self.user.local.score = data.score;
    User.update({ id: self.user._id }, self.user, function() {
      self.all.filter(function(user) {
        return user._id === self.user._id;
      })[0].local.score = data.score;
    });
  });

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if(token) {
      console.log(res);

      self.getUsers();
      self.user = TokenService.getUser();
    }

    self.message = res.message;
  }

  self.login = function(){
    User.login(self.user, handleLogin);
  }

  self.register = function() {
    console.log('Registered');
    User.register(self.user, handleLogin);
  }

  self.logout = function () {
    TokenService.removeToken();
    self.all = [];
    self.user = {};
  }

  self.getUsers = function() {
    User.query(function(data) {
      self.all = data.users;
    });
  }

  self.isLoggedIn = function() {
    return !!TokenService.getToken();
  }
  if (self.isLoggedIn ()){
    self.getUsers();
    self.user = TokenService.getUser();
  }
}








