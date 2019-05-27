/**
 * Inspection Controller
 */

eatSafeModule.controller('InspectionController', ['$scope','$state','eatSafeService','dataService' ,InspectionController]);

function InspectionController($scope,$state, eatSafeService, dataService) {
    console.log('InspectionController');
    var mobileView = 992;
    $scope.inspectionData={};
    $scope.inspectionTemplate={};
    $scope.inspectionTemplate.values=[];
    $scope.inspectionForm={};
    $scope.inspectionForm.checkedValue=[];
    $scope.complianceData={};
    $scope.complianceRecords={};
    $scope.complianceRecords.finalList=[];
    $scope.inspection={};
    $scope.inspectionForm={
			header:"Compliance Status",
			items:[{
				    	checkedValue:"NO",
					},
					{
				    	checkedValue:"NO",
					},{
				    	checkedValue:"NO",
					},{
				    	checkedValue:"NO",
					},
			  ]
			
	}
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
		
	/*	dropZone.ondrop = function(e) {
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
		}*/
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
    			return false;
    		}
    	});
    	
    }
    
    $scope.generateInspectionForm=function(){
    	
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
			 $scope.createInspection();
			 $scope.loadInformRules();
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
    $scope.createInspection=function(){
	    eatSafeService.createInspectionForm().then(function (response) {
	    	$scope.inspectionTemplate=response;
	    	console.log($scope.inspectionTemplate);
	    },function (response) {
	        console.log(response);
	    });
    }
    $scope.createNewInspectionRecord=function(){
    	$scope.inspectionForm={
    			header:"Compliance Status",
    			items:[{
					    	checkedValue:"NO",
    					},
    					{
					    	checkedValue:"NO",
    					},{
					    	checkedValue:"NO",
    					},{
					    	checkedValue:"NO",
    					},
    			  ]
    			
    	}
    	$('#inspectionModal').modal('show');
    }

    $scope.updateInspectionRecord=function(){
    	$('#commitBtn').text("Update Changes");
    	$('#inspectionModal').modal('show');
    }
    
    $scope.updateInspectionDescription=function(val){
    	$('#commitDescBtn').text("Update Changes");
    	$('#inspectionDescModal').modal('show');
    }
    
    $scope.saveInspectionForm=function(){
    	console.log($scope.inspectionForm);
    	$('#closeBtn').click();
    	$scope.inspectionForm.items=[];
    }
    $scope.inspectionFormData=function(option, val, index){
    	$scope.complianceData={
    		  	id:null,
    		  	complianceOptions:$scope.inspectionForm.checkedValue || 0,
    			title:{
    				text:null,
    				complianceType:null,
        			descriptions:{
        				id:null,
        				entry:null,
        				list:[
            				  {
            					  index:null,
            					  complianceType:null,
            					  text:null,
            					  options:[]
            				  }  
            		    ]
        			},
    			},
    		};
    	if(option=='ADD'){
    		
    		$('#inspectionDataModal').modal('show');
    		$('#inspectionDataModalLabel').text("Add Inspection Title")
    	}
    	if(option=='UPDATE'){
    		$scope.complianceData.title.text=val.title;
    		$scope.complianceData.id=index;
    		$('#inspectionDataModalLabel').text("Update Inspection Title")
    		$('#inspectionDataModal').modal('show');
    	}
    	if(option=='DELETE'){
    		var filtered = $scope.complianceRecords.finalList.filter(function(item) { 
    			   return item.index !== index;  
    			});
    		$scope.complianceRecords.finalList=filtered;
    	}
    }
    $scope.saveAndGenerateFormData=function(){
    	if($scope.complianceData.id==null){
    		var recordData={
    				index:$scope.complianceRecords.finalList.length,
    				id:$scope.complianceRecords.finalList.length+1,
					title:$scope.complianceData.title.text,
					descriptions:[]
			};
	    	$scope.complianceRecords.finalList.push(recordData);
	    	$('#closeCompBtn').click();
    	}else{
    	$.each($scope.complianceRecords.finalList,function(k,v){
	    		if(k == $scope.complianceData.id){
	    			v.title=$scope.complianceData.title.text;
	    			$('#closeCompBtn').click();
	    			return false;
	    		}
	    	});	
    	}
    }
    
    $scope.manageDescription=function(option,desc, parent, index){
    	if(option=='ADD'){
    		$('#inspectionDataDescModal').modal('show');
    		$('#inspectionDataDescModalLabel').text("Add Description");
    		$scope.inspection.parentIndex=parent.index;
    		$scope.inspection.index = parent.descriptions.length;
    		$scope.inspection.value="NEW";
    	}
    	else if(option=='UPDATE'){
    		$('#inspectionDataDescModal').modal('show');
    		$('#inspectionDataDescModalLabel').text("Update Description");
    		$scope.inspection.index=desc.index;
    		$scope.inspection.parentIndex=parent.index;
    		$scope.inspection.description = desc.text;  
    		console.log(index);
    		console.log(desc.text);
    		console.log(parent)
    		console.log("ParentIndex : "+parent.index);
    		console.log("ChildIndex : "+desc.index);
    	}
    	else if(option=='DELETE'){
    		$scope.inspection.index=desc.index;
    		$scope.inspection.parentIndex=parent.index;
    		var filteredDesc = parent.descriptions.filter(function(item) { 
 			   return item.index !== desc.index;  
 			});
    		console.log(filteredDesc);
	 		$.each($scope.complianceRecords.finalList,function(k,v){
	 			if(k==parent.index){
	 				v.descriptions=filteredDesc;
	 				return false;
	 			}
	 		});
    	}
    }
    $scope.saveOrUpdateDescription=function(){
    	if($scope.inspection.value=="NEW"){
    		var parentIndex= $scope.inspection.parentIndex;
    		    var desc={
						index:$scope.inspection.index,
						id:$scope.complianceRecords.finalList[parentIndex].descriptions.length + 1,
						complianceType:"IN",
						text:$scope.inspection.description,
						options:[]
					};
    		$scope.complianceRecords.finalList[parentIndex].descriptions.push(desc);
    		$('#closeDescBtn').click();
    	}else{
	    	var parentIndex= $scope.inspection.parentIndex;
	    	var childIndex = $scope.inspection.index;
	    	$scope.complianceRecords.finalList[parentIndex].descriptions[childIndex].text=$scope.inspection.description;
	    	$('#closeDescBtn').click();
    	}
    	console.log($scope.complianceRecords.finalList);
    }

    
    $scope.loadInformRules=function(){
       	var rules=null;
    	eatSafeService.getInspectionRules()
    	.then(function(data){
    		rules=data;
    		$.each(rules,function(key,val){
    			var descriptions=[];
    			$.each(val.values,function(key1,val2){
    				var desc={
    							index:key1,
    							id:key1 + 1,
    							complianceType:"IN",
    							text:val2.row,
								 options:[]
    						};
    				descriptions.push(desc);
    			});
    			var recordData={
    					index:key,
    					id:key+1,
    					title:val.name,
    					descriptions:descriptions
    			};
    	    	$scope.complianceRecords.finalList.push(recordData);
    	    	console.log($scope.complianceRecords);
    		});
    	},function(data){
    		console.log(data);
    	});
    	
    }
    
    $scope.saveInspection=function(){
    	var inspectionReport={
    			state:$('#stateselect option:selected').text(),
    			establishmentName:$scope.establishments.selected.name,
    			address:$scope.establishments.selected.address,
    			inspection_report:JSON.stringify($scope.complianceRecords.finalList)
    	}
    	console.log(inspectionReport);
    	eatSafeService.saveInspectionForm(inspectionReport)
    	.then(function(data){
    		console.log(data);
    	},function(data){
    		
    	});
    }
   
}