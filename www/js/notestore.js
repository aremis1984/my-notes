//creación del servicio con las funciones a utilizar por la app depende de mynotes módulo principal
angular.module('mynotes.notestore', ['ionic', 'ngCordova'])
	.factory('NoteStore', function($cordovaSocialSharing, $cordovaPush, $cordovaContacts) {

		var notes = angular.fromJson(window.localStorage['notes'] || '[]');
		  //almacenamiendo en el localsotarege del navegador en json
		function persist() {

		  	window.localStorage['notes'] = angular.toJson(notes);
		};



	  return {

	    list: function() {
	    //localStorage.clear();
	      return notes;
	    },

	    get: function(noteId) {
	      for (var i = 0; i < notes.length; i++) {
	        if (notes[i].id === noteId) {
	          return notes[i];
	        }
	      }
	      return undefined;
	    },

	    create: function(note) {
	      notes.push(note);
	      persist();
	     // register();
	     // messagePush(note);
	    },

	    update: function(note) {
	      for (var i = 0; i < notes.length; i++) {
	        if (notes[i].id === note.id) {
	          notes[i] = note;
	          persist();
	         // register();
	          return;
	        }
	      }
	    },
	    //para reordenar intercambiamos elementos en el array
	    move: function(note, fromIndex, toIndex) {
	    	notes.splice(fromIndex, 1);
	    	notes.splice(toIndex, 0, note);
	    	persist();
	    },

	    share: function(noteId) {
	      for (var i = 0; i < notes.length; i++) {
	        if (notes[i].id === noteId) {
	        	$cordovaSocialSharing.shareViaEmail(notes[i].description, notes[i].title, '', '', '', '');
			    //$cordovaSocialSharing.share(notes[i].description, notes[i].title, "", "");
	        	return;
	        }
	      }
	    },

	    sms: function(noteId, groups) {
	      for (var i = 0; i < notes.length; i++) {
	        if (notes[i].id === noteId) {
	        	for(var j = 0; j< groups.length; j++){
	        		if(notes[i].group.name == groups[j].name){
	        			//alert(groups[j].numbers);
	        			$cordovaSocialSharing.shareViaSMS(notes[i].description, groups[j].numbers);
	        			return;
	        		}
	        	}
	        }
	      }
	    },

	    remove: function(noteId) {
	      for (var i = 0; i < notes.length; i++) {
	        if (notes[i].id === noteId) {
	          notes.splice(i, 1);
	          persist();
	          return;
	        }
	      }
	    }

	  };

	});
