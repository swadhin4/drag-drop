testAPP.controller('dropController',
		[
				'$scope',
				'$rootScope',
	function($scope, $rootScope) {
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
			 $scope.csvContent = $scope.CSV2JSON(contents);
		}

		$scope.getContents = function() {
			var csvObject= JSON.parse($scope.csvContent);
			$.each(csvObject, function(key, val) {
				$scope.csvData.push(val);
			});
			console.log($scope.csvData);
			$('#csvdataid').attr("style","height: 456px");
			  
		}
		
		$scope.getMapValues=function(indexPos){
			console.log($scope.selectedMap);
			console.log($scope.selectedCSV);
			$.each( $scope.csvHeaders,function(key,val){
				if(key==indexPos){
				$scope.selectedCSV[key]=val;
				return false;
				}
			});
			var res = $scope.csvData.map(function(v, i) {
				if(i==indexPos){
				  var returnObj = {
				    index: i,
				    csvValue:v,
				    dbHeader:$scope.selectedMap[indexPos].dbCol
				  };
				  mappedArray.push(returnObj)
				  return mappedArray;
				}
			});
			console.log(mappedArray);
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
