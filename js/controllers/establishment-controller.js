eatSafeModule.controller('EstablishmentController', ['$scope','$rootScope','$state','filterFilter','csvService',	'eatSafeService',EstablishmentController]);
	function EstablishmentController ($scope, $rootScope,$state, filterFilter, csvService, eatSafeService) {
		$scope.csvFile = "";
		var mobileView = 992;
		$scope.csvContent="";
		$scope.csvData={};
		$scope.csvHeaders = [];
		$scope.csvColDbColMap = [];
		$scope.csvData.records=0;
		$scope.dbColsArray=[];
		$scope.errorMsg="";
		$scope.successMsg="";
		$scope.uniqueHeadersArray=[];
		$scope.files=null;
		var dropZone = document.getElementById('drop-zone');
		angular.element(document).ready(function() {
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
		
		  $scope.currentPage = 1;
		  $scope.pageSize = 20;
		  
		$scope.getOptionSelection=function(optionSelected){
			console.log(optionSelected)
			if(optionSelected.toUpperCase()=="INSPECTION"){
				$state.go('inspection', $state.current, {}, {reload: true});
			}else{
				$scope.csvContent="";
				$scope.csvData={};
				$scope.csvHeaders = [];
				$scope.csvColDbColMap = [];
				$scope.csvData.records=0;
				$scope.dbColsArray=[];
			}
			
		}
		$scope.filterBy=function(filterValue){
			$scope.search=filterValue;
		}
		$scope.startUpload = function(files) {
			console.log(files);
			$scope.csvFile =  files[0].name.substr(0, files[0].name.lastIndexOf('.')).toUpperCase();
			var reader = new FileReader();
			reader.onload = $scope.convertCSVToJSON;
			reader.readAsText(files[0]);
		}
		$scope.convertCSVToJSON = function(f) {
			 var contents = f.target.result;
			 var allTextLines = contents.split(/\r\n|\n/);
			 var headers = allTextLines[0].toLowerCase().split(',');
			 $scope.csvHeaders=headers;
			 $scope.csvData.header=headers;
			 csvService.CSV2JSON(contents) .then(function(data){
				$scope.csvContent = data; 
				$scope.getContents();
				$scope.getDBColumns($scope.selectedOption);
			 },function(data){
				 console.log(data);
			 });
		}
		$scope.getDBColumns=function(est){
			eatSafeService.getDbColumns(est).then(function(response){
				console.log(response);
				$scope.dbColsArray=[];
				$scope.dbColsArray=response.object;
			},function(response){
				console.log(response);
			});
		}
		$scope.getContents = function() {
			var csvObject= JSON.parse($scope.csvContent);
			$scope.dataLoaded = $.jStorage.set('fileselected', csvObject);
			var dataObject=[];
			$scope.csvData.rowObj=[];
			$.each($scope.dataLoaded, function(key, val) {
				var ob=[];
				var a={};
				var index=key;
				for(k in val){
					var obj={
						i: k.toLowerCase(),
						v:val[k],
						
					};
					ob.push(obj);
					++index;
				}
				a=ob;
				dataObject.push({index:key,obj:a});
			});
			$scope.csvData.rowObj=dataObject;
			$scope.csvData.records=$scope.csvData.rowObj.length;
			$scope.totalItems = $scope.csvData.rowObj.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		//	console.log($scope.csvData.rowObj);
		}
		
		  $scope.pageChangeHandler = function(num) {
		      console.log('Recors page changed to ' + num);
		  };
		  $scope.selectRecord = function(item) {
			    item.selected ? item.selected = false : item.selected = true;
		  }
		  $scope.getCurrentVal=function(selectedIndex){
				$scope.oldTempDbCol = $('#csvSelect'+selectedIndex).val();
		  }
		$scope.populatedDataMap=function(dbColumnIndex, dbColumnVal, csvIndex, csvIndexVal ){
			var csvObject={
					csvIndex:csvIndex,
					csvVal:csvIndexVal.toLowerCase(),
			}
			var dbObject={
					dbIndex:dbColumnIndex,
					dbColVal:dbColumnVal
			}
			$scope.csvDbMap={};
			$scope.csvDbMap.uniqueHeaders=[];
			var isKeyExist=false;
			var isValueExist=false;
			var count= $scope.csvColDbColMap.length;
			$.each($scope.csvColDbColMap,function(key,val){
				console.log(key, val);
				for(k in val){
					if(k == "csvcol"){
						console.log(val[k])
						if(val[k] == csvIndexVal){
							isKeyExist=true;
							//Updating value  
							console.log(dbObject)
							if($scope.checkDuplicateValue(dbObject)){
								alert("DB Column already Mapped");
								isValueExist=true;
								$('#csvSelect'+csvIndex).val($scope.oldTempDbCol);
								$('#csvSelect'+csvIndex).attr("style","border-color: #c30707");
							}else{
							  $('#csvSelect'+csvIndex).removeAttr("style");
							  val.dbcol=dbObject.dbColVal;
							}
							break;
						}
					}
				}
			});
			if(count  == 0 || (count >0 && !isKeyExist) ){
				if($scope.checkDuplicateValue(dbObject)){
					alert("DB Column already Mapped");
					isValueExist=true;
					$('#csvSelect'+csvIndex).val($scope.oldTempDbCol);
					$('#csvSelect'+csvIndex).attr("style","border-color: #c30707");
				}else{
					$scope.csvDbMap.csvcol=csvObject.csvVal;
					//Adding value
					$scope.csvDbMap.dbcol=dbObject.dbColVal;
					$scope.csvColDbColMap.push($scope.csvDbMap);
					$('#csvSelect'+csvIndex).removeAttr("style");
				}
			}
			if(isValueExist){
				return false;
			}
			console.log($scope.uniqueHeadersArray);
		}
		
		$scope.checkDuplicateValue=function(dbObject){
			var isValueExist=false;
			$.each($scope.csvColDbColMap,function(key,val){
				console.log(key, val);
				for(k in val){
					if(k == "dbcol"){
						console.log("DBValue :"+ val[k])
						if(val[k] == dbObject.dbColVal){
							isValueExist=true;
							break;
						}
					}
				}
			});
			if(isValueExist){
				return true;
			}else{
				return false;
			}
		}

		$scope.populateCSVData=function(){
			console.log();
			console.log($scope.csvData.rowObj);
			var finalArr=[];
			$.each($scope.csvData.rowObj,function(key,val){
				var establishment={};
				$.each(val.obj,function(k,v){
					establishment[v.i]=v.v;
				});
				finalArr.push(establishment)
			});
			console.log(finalArr);
			$scope.dataLoaded=finalArr;
		}
		
		$scope.saveMappedData=function(){
		   console.log("Inside saveMappedData "+ new Date());
		   $('#loadingDiv').show();
		   var dataSelected= $scope.selectedOption;
		   $scope.populateCSVData();
            var mapObject={};
            $.each($scope.csvColDbColMap ,function(key,val){
              for(k in val){
                 mapObject[val.csvcol]=val.dbcol;
              }
            });
             var CsvDBColMapData={
                  dataType:dataSelected,
                  establishmentList:$scope.dataLoaded,
                  csvDbColsList:JSON.stringify( mapObject ),
                  csvHeaders:$scope.csvHeaders
                          
             };
             console.log(CsvDBColMapData); 
             if(CsvDBColMapData.csvDbColsList.length>0){
            	 eatSafeService.saveMapData(CsvDBColMapData).then(function(response){
                     console.log(response);
                     $('#loadingDiv').hide();
                     $('#modal-success').modal('show');
                     $scope.successMsg=response.message;
               },function(response){
                     console.log(response);
                     $('#modal-danger').modal('show');
                     $scope.errorMsg="Error saving data";
                     $('#loadingDiv').hide();
               });
             }else{
            	 $('#modal-danger').modal('show');
             }
            
		}  
		
		  $scope.getRestaurantData=function(){
		     console.log("Inside getRestaurantData "+ new Date());
             console.log(CsvDBColMapData);            
             eatSafeService.getRestaurantData('EST').then(function(response){
                   console.log(response);
                   if(response.status==200){
                	   $scope.dataLoaded=response.object;
                   }
             },function(response){
                   console.log(response);
             });
			}  
}

