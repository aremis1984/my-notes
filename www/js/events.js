angular.module('mynotes.Events', ['ionic', 'ngCordova'])
	.factory('Events', function($cordovaCalendar) {

	var events = angular.fromJson(window.localStorage['events'] || '[]');
    //almacenamiendo en el localsotarege del navegador en json
  	function persistEvents() {
  		
    	window.localStorage['events'] = angular.toJson(events);
  	};

	return{

		get: function(){
			return events;
			//localStorage.clear();
		},

		saveEvent: function(newEv){
			//alert(newEv);
      		//alert("titulo: "+t+" descripcion:"+d+" fecha: "+dat);

      		/*var eachEvent = {
		    	id: newEv.id,
		        title: newEv.title,
		        description: newEv.description,
		        date: newEv.date
		    };*/

		  $cordovaCalendar.createEventWithOptions({
			    title: newEv.title,
			    location: '',
			    notes: newEv.description,
			    startDate: newEv.date,
			    endDate: newEv.date
			
			  }).then(function (result) {
			    // success
			    alert("Evento añadido al calendario");
			  }, function (err) {
			    // error
			    alert("Error: "+err);
			});

		    events.push(newEv);
		    //alert(ev);
		    persistEvents();
		},

		deleteEvent: function(evId){
			//alert(evid);
			for (var i = 0; i < events.length; i++) {
		        if (events[i].id === evId) {
		          
		          $cordovaCalendar.deleteEvent({
					title: events[i].title,
				    location: '',
				    notes: events[i].description,
				    startDate: events[i].date,
				    endDate: events[i].date
				  }).then(function (result) {
				    // success
				    alert("Evento borrado del calendario.");
				  }, function (err) {
				    // error
				    alert("Error al eliminar evento.");
				  });

				  events.splice(i, 1);
		          persistEvents();
		          return;
		        }
		    }
		},

	};


});