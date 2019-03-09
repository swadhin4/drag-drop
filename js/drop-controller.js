testAPP.controller('dropController',
		[
				'$scope',
				'$rootScope',
				'filterFilter',
				'csvService',
	function($scope, $rootScope, filterFilter, csvService) {
		$scope.test = "hello";
		$scope.csvFile = "";
		var mobileView = 992;
		$scope.csvContent="";
		$scope.csvData=[];
		$scope.csvHeaders = [];
		$scope.dataFields = [];
		$scope.selectedMap=[];
		$scope.selectedCSV=[];
		var mappedArray=[];
		angular.element(document).ready(function() {
			$scope.dataFields=[];
			$scope.dbColsArray=[];
			$scope.selectDbColsArray=[];
			var dropZone = document.getElementById('drop-zone');
			dropZone.ondrop = function(e) {
				e.preventDefault();
				this.className = 'upload-drop-zone';
				$scope.startUpload(e.dataTransfer.files)
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
		
		$scope.filterBy=function(filterValue){
			$scope.search=filterValue;
		}
		$scope.startUpload = function(files) {
			console.log(files);
			console.log(files[0]);
			$scope.csvFile =  files[0].name.substr(0, files[0].name.lastIndexOf('.')).toUpperCase();
			var reader = new FileReader();
			reader.onload = $scope.getFileContents;
			reader.readAsText(files[0]);
		}
		$scope.getFileContents = function(f) {
			var contents = f.target.result;
			 var allTextLines = contents.split(/\r\n|\n/);
			 var headers = allTextLines[0].split(',');
			 $scope.csvHeaders=headers;
			 $scope.csvData.header=headers;
			 csvService.CSV2JSON(contents)
			 .then(function(data){
				 $scope.csvContent = data; 
				 $scope.getContents();
			 },function(data){
				 console.log(data);
			 });
			
		}

		$scope.getContents = function() {
			var csvObject= JSON.parse($scope.csvContent);
			var dataObject=[];
			$scope.csvData.rowObj=[];
			$.each(csvObject, function(key, val) {
				var ob=[];
				var a={};
				var index=key;
				for(k in val){
					var obj={
						i:k,
						v:val[k]
					};
					ob.push(obj);
				}
				a=ob;
				dataObject.push({index:key,obj:a});
			});
			
			$scope.csvData.rowObj=dataObject;
			console.log($scope.csvData);
			$scope.totalItems = $scope.csvData.rowObj.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
			
			$scope.dbColsArray=$scope.csvData.header;
		}
		 $scope.pageChangeHandler = function(num) {
		      console.log('meals page changed to ' + num);
		  };
		  $scope.selectRecord = function(item) {
			    item.selected ? item.selected = false : item.selected = true;
		  }
		$scope.getCSVDBMap=function(){
			
		}  
		
		$scope.getCurrentVal=function(selectedIndex){
			$scope.oldTempDbCol = $('#csvSelect'+selectedIndex).val();
		}
		$scope.populatedDataMap=function(dbColumnIndex, dbColumnVal, csvIndex, csvIndexVal ){
			var csvObject={
					csvIndex:csvIndex,
					csvVal:csvIndexVal,
			}
			var dbObject={
					dbIndex:dbColumnIndex,
					dbColVal:dbColumnVal
			}
			$scope.csvDbMap={};
			var isKeyExist=false;
			var isValueExist=false;
			var count= $scope.dataFields.length;
			$.each($scope.dataFields,function(key,val){
				console.log(key, val);
				for(k in val){
					if(k == "key"){
						console.log(val[k])
						if(val[k] == csvIndexVal){
							isKeyExist=true;
							//Updating value  
								console.log(dbObject)
								if($scope.checkDuplicateValue(dbObject)){
									alert("DB Column already Mapped");
									isValueExist=true;
									$('#csvSelect'+csvIndex).val($scope.oldTempDbCol);
								}else{
								  val.value=dbObject.dbColVal;
								}
							break;
						}
					}
					
					
				}
			});
			
			if(count  == 0 || (count >0 && !isKeyExist) ){
				$scope.csvDbMap.key=csvObject.csvVal;
				//Adding value
				$scope.csvDbMap.value=dbObject.dbColVal;
				$scope.dataFields.push($scope.csvDbMap);
			}
				
			if(isValueExist){
				return false;
			}
			console.log($scope.csvDbMap);
			console.log($scope.dataFields);
			
		}
		
		$scope.checkDuplicateValue=function(dbObject){
			var isValueExist=false;
			$.each($scope.dataFields,function(key,val){
				console.log(key, val);
				for(k in val){
					if(k == "value"){
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
		
		$scope.toggleDBColsArray=function(i,s,k,v){
			$scope.selectDbColsArray[k]=s;
			/*var index = $scope.csvData.header.indexOf(s);
			if (index > -1) {
				$scope.csvData.header.splice(index, 1);
			}*/
			console.log(k, $scope.selectDbColsArray[k]);
			console.log($scope.csvData.header);
		}
		
		 
} ]);
