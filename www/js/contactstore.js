//creación del servicio con las funciones a utilizar por la app depende de mynotes módulo principal
angular.module('mynotes.contactstore', ['ionic', 'ngCordova'])
	.factory('ContactStore', function($cordovaContacts) {

	var groups = angular.fromJson(window.localStorage['groups'] || '[]');
    //almacenamiendo en el localsotarege del navegador en json
  	function persistContacts() {
  		
    	window.localStorage['groups'] = angular.toJson(groups);
  	};

	return{

		listgroups: function() {
			//localStorage.clear();
			return groups;
	    },

	    get: function(groupId) {
	      for (var i = 0; i < groups.length; i++) {
	        if (groups[i].id === groupId) {
	          return groups[i];
	        }
	      }
	      return undefined;
	    },

		createGroup : function(group){

		    var cont = $("#cont").val();
		    var name = $("#name").val();
		    
		    contact_phone = "";

		    for (var j = 0; j < groups.length; j++) {
	        	if(name == groups[j].name){
	        		alert("Este nombre ya existe, escoja otro.");
	        		return false;
	        	}
	        }
		    
		    for(var i = 0; i <= cont; i++){
		      var contact = $("#contact"+i+"").val();
		    
		      if(contact != undefined && contact != ""){

			        contact_phone = contact_phone+contact;
			        if(i != cont){
			        	contact_phone = contact_phone+",";
			        }
		       
		      }
		    }
		   // contact_phone = contact_phone.slice(0,-1);
		    var eachContact = {
		    	id: group.id,
		        name: name,
		        numbers: contact_phone
		    };
		    groups.push(eachContact);
		    persistContacts();
		    //console.log(groups);
		},

		seeContacts: function(n){
			$cordovaContacts.pickContact().then(function (contactPicked) {
		     var contact = angular.fromJson(contactPicked.phoneNumbers); 
		     alert(contactPicked);
			    var num = JSON.stringify(contact[0]['value']);
			    var nc = num.replace("\"","");
			    nc = nc.replace(/\s+/g, '');
			    nc = nc.slice(0,-1);
			 
			   $("#"+n).val(nc);
		    });
		},
	
		updateGroup: function(group){
			var name = group.name;
			for (var j = 0; j < groups.length; j++) {
	        	if(name == groups[j].name && groups[j].id != group.id){
	        		alert("Este nombre ya existe, escoja otro.");
	        		return false;
	        	}
	        }
			for (var i = 0; i < groups.length; i++) {
		        if (groups[i].id === group.id) {
		          groups[i].name = group.name;
		           var cont = $("#cont").val();
		           contact_phone = "";
			        for(var j = 0; j <= cont; j++){
					      var contact = $("#contact"+j+"").val();
					    if(contact != undefined && contact != "" && contact != " "){
					        
					        contact_phone = contact_phone+contact;
					        if(j != cont){
					        	contact_phone = contact_phone+",";
					        }
					       
			        	}
		    		}
		    		//contact_phone = contact_phone.slice(0,-1);
		    		groups[i].numbers = contact_phone;
		          persistContacts();
		          return;
		        }
	      	}
		},

		removeGroup: function(groupId){
			for (var i = 0; i < groups.length; i++) {
	        if (groups[i].id === groupId) {
	          groups.splice(i, 1);
	          persistContacts();
	          return;
	        }
	      }
		}

	};

});