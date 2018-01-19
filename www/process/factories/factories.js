app.factory('sessionFactory', function(localStorageService) {
  return {
      getSession: getSession,
      getUser: getUser,
      setSession: setSession,
      setUser: setUser,
      unsetUser: unsetUser,

  }

  function getSession(){
      return localStorageService.get('user_logged_in');
  }

  function setSession(data){
      localStorageService.set('user_logged_in',data);
  }

  function getUser(){
      return localStorageService.get('user_data');
  }

  function setUser(data){
      localStorageService.set('user_data',data);
  }

  function unsetUser( ){
      localStorageService.remove('user_data');
  }
  
})