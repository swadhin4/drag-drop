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
		  $scope.pageSize = 10;
		
		$scope.filterBy=function(filterValue){
			$scope.search=filterValue;
		}
		$scope.startUpload = function(files) {
			console.log(files);
			console.log(files[0]);
			$scope.csvFile = files[0].name;
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
		}
		 $scope.pageChangeHandler = function(num) {
		      console.log('meals page changed to ' + num);
		  };
		  $scope.selectRecord = function(item) {
			    item.selected ? item.selected = false : item.selected = true;
		  }
		$scope.getCSVDBMap=function(){
			
		}  
		
		$scope.populatedDataMap=function(dbColumnIndex, dbColumnVal, csvIndexVal, csvIndex){
			var csvObject={
					csvIndex:csvIndex,
					csvVal:csvIndexVal,
			}
			var dbObject={
					dbIndex:dbColumnIndex,
					dbColVal:dbColumnVal
			}
			console.log(mappObject);
			if(mappedArray.length==0){
				mappedArray.push(mappObject);
			}else{
				for(var i=0;i<mappedArray.length;i++){
					if(mappedArray[i].csvIndex==csvIndex){
						if(mappedArray[i].csvVal!=dbColumnVal){
							mappedArray.splice(i, 1);
							break;
						}
						
					}
				}
				
			}
			console.log(mappedArray);
			
		}
		 
} ]);
