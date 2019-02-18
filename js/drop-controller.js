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
			$scope.dataFields=["Firstname", "Middlename", "Lastname", "age", "salary", "address", "state", "city", "zip", "mobile", "email"];
			 
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
		
		$scope.search = {};

		$scope.resetFilters = function () {
			// needs to be a function or it won't trigger a $watch
			$scope.search = {};
		};

		// pagination controls
		$scope.currentPage = 1;
		$scope.entryLimit = 3; // items per page
		

		// $watch search to update pagination
		$scope.$watch('search', function (newVal, oldVal) {
			$scope.filtered = filterFilter($scope.csvData, newVal);
			$scope.totalItems = $scope.filtered.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
			$scope.currentPage = 1;
		}, true);
		
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
			$.each(csvObject, function(key, val) {
				var ob=[];
				var a={};
				for(k in val){
					var obj={
						i:k,
						v:val[k]
					};
					console.log(obj);
					ob.push(obj);
				}
				a=ob;
				dataObject.push(a);
			});
			
			$scope.csvData.rowObj=dataObject;
			console.log($scope.csvData);
			$scope.totalItems = $scope.csvData.rowObj.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		}
		
		$scope.populatedDataMap=function(indexPos, dbField, csvHeader){
	/*			var checkDuplicate=false;
				$.each(mappedArray,function(key,val){
					if(dbField==val.dbColName){
						checkDuplicate=true;
	 				  	return false;
					}
				});
				
				if(checkDuplicate){
					alert("This is already selected");
					return false;
				}else{
					var isUpdate=false;
					var selectedRow={
							r:indexPos,
							csvColName:csvHeader,
							dbColName:dbField
					}
						$.each(mappedArray,function(key,val){
							if(csvHeader==val.csvColName){
								val.dbColName=dbField;
								isUpdate=true;
			 				  	return false;
							}
						});
					if(!isUpdate){
						mappedArray.push(selectedRow)
					}
						
				}
			console.log(mappedArray);*/
		}

		$scope.CSVToArray = function(strData, strDelimiter) {
			// Check to see if the delimiter is defined. If not,
			// then default to comma.
			strDelimiter = (strDelimiter || ",");
			// Create a regular expression to parse the CSV values.
			var objPattern = new RegExp((
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
			// Create an array to hold our data. Give the array
			// a default empty first row.
			var arrData = [ [] ];
			// Create an array to hold our individual pattern
			// matching groups.
			var arrMatches = null;
			// Keep looping over the regular expression matches
			// until we can no longer find a match.
			while (arrMatches = objPattern.exec(strData)) {
				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[1];
				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.
				if (strMatchedDelimiter.length
						&& (strMatchedDelimiter != strDelimiter)) {
					// Since we have reached a new row of data,
					// add an empty row to our data array.
					arrData.push([]);
				}
				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[2]) {
					// We found a quoted value. When we capture
					// this value, unescape any double quotes.
					var strMatchedValue = arrMatches[2].replace(
							new RegExp("\"\"", "g"), "\"");
				} else {
					// We found a non-quoted value.
					var strMatchedValue = arrMatches[3];
				}
				// Now that we have our value string, let's add
				// it to the data array.
				arrData[arrData.length - 1].push(strMatchedValue);
			}
			// Return the parsed data.
			return (arrData);
		}

		$scope.CSV2JSON = function(csv) {
			var array = $scope.CSVToArray(csv);
			var objArray = [];
			for (var i = 1; i < array.length; i++) {
				objArray[i - 1] = {};
				for (var k = 0; k < array[0].length
						&& k < array[i].length; k++) {
					var key = array[0][k];
					objArray[i - 1][key] = array[i][k]
				}
			}

			var json = JSON.stringify(objArray);
			var str = json.replace(/},/g, "},\r\n");

			return str;
		}
} ]);
