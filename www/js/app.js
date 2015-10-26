//encapsulamos todo en una funcion anónima para evitar que sea global y afecte a futuros desarrollos
(function() {
/* módulo angular mynotes depende de ionic y del servicio notestore  */
var app = angular.module('mynotes', ['ionic', 'mynotes.notestore']);

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
app.controller('ListCtrl', function($scope, NoteStore) {

  $scope.reordering = false;
  $scope.notes = NoteStore.list();

  $scope.remove = function(noteId) {
    NoteStore.remove(noteId);
  };

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
app.controller('AddCtrl', function($scope, $state, NoteStore) {

  $scope.note = {
    id: new Date().getTime().toString(),
    title: '',
    description: ''
  };

  $scope.save = function() {
    NoteStore.create($scope.note);
    $state.go('list');
  };
});
//controlador para edición de notas
app.controller('EditCtrl', function($scope, $state, NoteStore) {

  $scope.note = angular.copy(NoteStore.get($state.params.noteId));

  $scope.save = function() {
    NoteStore.update($scope.note);
    $state.go('list');
  };
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