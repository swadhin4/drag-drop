/**
 * Inspection Controller
 */

eatSafeModule.controller('InspectionController', ['$scope','$state','eatSafeService','dataService' ,InspectionController]);

function InspectionController($scope,$state, eatSafeService, dataService) {
    console.log('InspectionController');
    var mobileView = 992;
    $scope.inspectionData={};
    $scope.states=[];
    $scope.establishments={
    		list:[],
    		selected:{}
    };
    var dropZone = document.getElementById('drop-zone');
	angular.element(document).ready(function() {
		console.log($scope.establishments.selected.id==null);
		if($scope.dataLoaded==null){
			$.jStorage.set('fileselected', null);
		}
		$scope.selectDbColsArray=[];
		
		dropZone.ondrop = function(e) {
			e.preventDefault();
			this.className = 'upload-drop-zone';
			if($scope.selectedOption!=null){
				$scope.startUpload(e.dataTransfer.files)
			}else{
				alert("Please select CSV Type");
			}
		}

		dropZone.ondragover = function() {
			this.className = 'upload-drop-zone drop';
			return false;
		}

		dropZone.ondragleave = function() {
			this.className = 'upload-drop-zone';
			return false;
		}
	});
    $scope.getOptionSelection=function(optionSelected){
		console.log(optionSelected)
		if(optionSelected.toUpperCase()=="ESTABLISHMENT"){
			$state.go('est', $state.current, {}, {reload: true});
		}else{
			$scope.getUSStates();
			 $scope.getInspectionForm();
		}
	}
    
    $scope.getStateSelection=function(optionSelected){
		console.log(optionSelected)
		$scope.getEstablishments(optionSelected);
	}
    
    $scope.getEstablishmentSelection=function(optionSelected){
    	$.each($scope.establishments.list,function(k,v){
    		if(parseInt(optionSelected) == v.id){
    			$scope.establishments.selected=v;
    			// $scope.getInspectionForm();
    			return false;
    		}
    	});
    	
    }
    
   
    $scope.getEstablishments=function(optionSelected){
    	eatSafeService.getRestaurantData('est',optionSelected).then(function(response){
    		console.log(response);
    		if(response.status==200){
    			var establishments = response.object;
    			 $("#establishmentselect").empty();
    			 var options = $("#establishmentselect");
    			 options.append($("<option />").val("").text("SELECT ESTALISHMENT"));
    			 $.each(establishments,function(k,v1) {
    				$scope.establishments.list.push(v1);
    				options.append($("<option />").val(v1.id).text(v1.name));
    		     });
    		}
    	},function(response){
    		console.log(response);
    	});
    }
    
    $scope.getUSStates=function(){
    	dataService.getUSAStates().then(function (response) {
	    	 console.log(response);
	    	 $scope.states=response;	
	    	 $("#stateselect").empty();
			 var options = $("#stateselect");
			 options.append($("<option />").val("").text("SELECT STATES"));
			 $.each($scope.states,function(k,v1) {
				options.append($("<option />").val(v1.abbreviation).text(v1.name));
		     });
    	},function (response) {
    	        console.log(response);
    	});
    }
    $scope.getInspectionForm=function(){
    eatSafeService.getInspectionRules().then(function (response) {
    	$scope.inspectionData=response;
    	console.log($scope.inspectionData);
    },function (response) {
        console.log(response);
    });
    }
}
