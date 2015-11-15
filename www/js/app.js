//encapsulamos todo en una funcion anónima para evitar que sea global y afecte a futuros desarrollos
(function() {
/* módulo angular mynotes depende de ionic y del servicio notestore  */
var app = angular.module('mynotes', ['ionic', 'ngCordova', 'mynotes.notestore', 'mynotes.contactstore', 'ionic.service.core','ionic.service.push']);

//configuración del routing de la aplicación mediante estados y del controlador a usar según el mismo
app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'templates/list.html'
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'templates/edit.html',
    controller: 'AddCtrl'
  });

  $stateProvider.state('listgroups', {
    url: '/listgroups',
    templateUrl: 'templates/listgroups.html'
  });

  $stateProvider.state('editgroup', {
    url: '/editgroup/:groupId',
    templateUrl: 'templates/editgroup.html',
    controller: 'EditGroupCtrl'
  });

  $stateProvider.state('addGroup', {
    url: '/addGroup',
    templateUrl: 'templates/editgroup.html',
    controller: 'AddGroupCtrl'
  });

  $stateProvider.state('edit', {
    url: '/edit/:noteId',
    templateUrl: 'templates/edit.html',
    controller: 'EditCtrl'
  });

  $urlRouterProvider.otherwise('/list');
});

/* las funciones a utilizar por los controladores llamaran a un servicio al que 
se ha llamado NoteStore ubicadas en notestore.js donde se encuentran desarrolladas */


//controlador donde mostramos y reordenamos la lista
app.controller('ListCtrl', function($scope, NoteStore, ContactStore, $cordovaSocialSharing, $cordovaPush) {

  $scope.reordering = false;
  $scope.notes = NoteStore.list();

  console.log($scope.notes);

  $scope.remove = function(noteId) {
    NoteStore.remove(noteId);
  };

  $scope.share = function(noteId) {
    NoteStore.share(noteId);
  };

  $scope.sms = function(noteId) {
    var groups = ContactStore.listgroups();
    NoteStore.sms(noteId, groups);
  };

  /*$scope.share = function(note) {
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === note.id) {
         $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com");
      }
    }
  };*/

  $scope.move = function(note, fromIndex, toIndex) {
    NoteStore.move(note, fromIndex, toIndex);
  };
  /* con esta funcion cambiamos el valor del parametro reordering de true a false o viceversa
  para decidir si queremos mostrar o no el icono para reordenar */
  $scope.toggleReordering = function() {
    $scope.reordering = !$scope.reordering;
  };

});
//controlador para añadir nueva nota
app.controller('AddCtrl', function($scope, $state, NoteStore, ContactStore) {

  $scope.note = {
    id: new Date().getTime().toString(),
    title: '',
    description: '',
    group: ''
  };

  $scope.groups = ContactStore.listgroups();

  $scope.save = function() {
    NoteStore.create($scope.note);
    $state.go('list');
  };

});

//list groups controlador

app.controller('ListgroupsCtrl', function($scope, $state, ContactStore) {
  $scope.groups = ContactStore.listgroups();
console.log($scope.groups);

  $scope.removeGroup = function(groupId) {
    ContactStore.removeGroup(groupId);
  };

});

//controlador para crear grupos de contactos

app.controller('AddGroupCtrl', function($scope, $cordovaContacts, $state, $location, ContactStore) {

  var fecha = new Date().getTime().toString();
  var clave = "grupo_"+fecha;

  $scope.group = {
    id: new Date().getTime().toString(),
    name: '',
    numbers: ''
  };

   $scope.cont = 0;
   $scope.choices = [];

  $scope.addOther = function() {
    var cont = $("#cont").val();
    n = ++cont;
    var newItemNo = n;
    var cont = $("#cont").val(n);
    $scope.choices.push({'id':'contact'+newItemNo, 'num':n});
  };

  $scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };

/*$scope.addOther = function(){

      var cont = $("#cont").val();
      n = ++cont;
      $("#cont").val(n);

      //$scope.other = "<div id = 'blok_contact"+n+"' class = 'item item-input'><input id = 'contact"+n+"' type = 'text' ng-model = 'number"+n+"' placeholder = 'Contacto "+n+"' /><button class = 'button button-energized' ng-click = \"seeContacts('contact"+n+"')\">Agenda</button><div><button class = 'button button-assertive icon-left ion-trash-b' onclick = 'removeContact("+n+")'></button></div></div>";
      $("#contacts_wraper").append("<div id = 'blok_contact"+n+"' class = 'item item-input'><input id = 'contact"+n+"' type = 'text'"+
        " ng-model = 'number"+n+"' placeholder = 'Contacto "+n+"' /><button class = 'button button-energized' ng-click = \"seeContacts('contact"+n+"')\">Agenda"+
        "</button><div><button class = 'button button-assertive icon-left ion-trash-b' onclick = 'removeContact("+n+")'></button></div></div>");
      
  };    */

  $scope.seeContacts = function(n){
      ContactStore.seeContacts(n);
  };

  $scope.saveContacts = function() {
    //ContactStore.createGroup($scope.group);
    //$state.go('listgroups');
    if(ContactStore.createGroup($scope.group) != false){
      $location.path('/listgroups');
    } 
  };
});

app.controller('EditGroupCtrl', function($scope, $cordovaContacts, $state, $location, ContactStore) {

  $scope.group = angular.copy(ContactStore.get($state.params.groupId));

  var string = $scope.group.numbers;
  var array = string.split(',');

  var array_numbers = [{}];

 

  for(var i = 0; i < array.length; i++){
    array_numbers[i] = new Array();
    array_numbers[i][0] = array[i];
    array_numbers[i][1] = "contact"+i+"";
  }
  var n = array_numbers.length;
  --n;
 $scope.cont = n;
  $scope.array = array_numbers;

  console.log(array_numbers);

  $scope.seeContacts = function(n){
      ContactStore.seeContacts(n);
  };
  
  $scope.choices = [];

  $scope.addOther = function() {
    var cont = $("#cont").val();
    n = ++cont;
    var newItemNo = n;
    var cont = $("#cont").val(n);
    $scope.choices.push({'id':'contact'+newItemNo, 'num':n});
  };

  $scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };

  /*$scope.addOther = function(){

      var cont = $("#cont").val();
      n = ++cont;
      $("#cont").val(n);

      //$scope.other = "<div id = 'blok_contact"+n+"' class = 'item item-input'><input id = 'contact"+n+"' type = 'text' ng-model = 'number"+n+"' placeholder = 'Contacto "+n+"' /><button class = 'button button-energized' ng-click = \"seeContacts('contact"+n+"')\">Agenda</button><div><button class = 'button button-assertive icon-left ion-trash-b' onclick = 'removeContact("+n+")'></button></div></div>";
      $("#contacts_wraper").append("<div id = 'blok_contact"+n+"' class = 'item item-input'><input id = 'contact"+n+"' type = 'text'"+
        " ng-model = 'number"+n+"' placeholder = 'Contacto "+n+"' /><button class = 'button button-energized' ng-click = \"seeContacts('contact"+n+"')\">Agenda"+
        "</button><div><button class = 'button button-assertive icon-left ion-trash-b' onclick = 'removeContact("+n+")'></button></div></div>");
      
  };   */ 

  $scope.saveContacts = function() {
    console.log($scope.group);
    if(ContactStore.updateGroup($scope.group) != false){
      //$state.go('listgroups');
      $location.path('/listgroups');
    }    
  };

});


//controlador para edición de notas
app.controller('EditCtrl', function($scope, $state, NoteStore, ContactStore) {

  $scope.note = angular.copy(NoteStore.get($state.params.noteId));
  $scope.groups = ContactStore.listgroups();

  $scope.save = function() {
    NoteStore.update($scope.note);
    $state.go('list');
  };
});




angular.module('notPush', ['ionic', 'ngCordova','ionic.service.core', 'ionic.service.push'])
.run(function($ionicPlatform, $rootScope, $http, $cordovaPush) {
  console.log('Ionic: Identificando al usuario');

    //Si no tenemos un user_id, generamos uno nuevo
    var user = $ionicUser.get();
    if(!user.user_id) {
      user.user_id = $ionicUser.generateGUID();
    };

    // Establecemos alguna información para nuestro usuario
    angular.extend(user, {
      name: 'Ivan',
      description: 'Fullstack Developer',
      location: 'Islas Canarias',
      website: 'http://ivanbtrujillo.com'
    });

    // Cuando tenemos todos los datos, nos identificamos contra el Ionic User Service

    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Usuario identificado: ' + user.name + '\n ID ' + user.user_id);
    });

    console.log('Registrando Para PUSH');

    // Lo registramos contra Ionic Service, los parametros son opcionales
    $ionicPush.register({
      canShowAlert: true, //Se pueden mostrar alertas en pantalla
      canSetBadge: true, //Puede actualizar badgeds en la app
      canPlaySound: true, //Puede reproducir un sonido
      canRunActionsOnWake: true, //Puede ejecutar acciones fuera de la app
      onNotification: function(notification) {
        // Cuando recibimos una notificacion, la manipulamos aqui
        alert(notification.message);
        return true;
      }
    });

    //Mostramos el token del dispositivo
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    console.log('Registrado correctamente. El token es: ' + data.token);
    $scope.token = data.token;
  });
});


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});



}());