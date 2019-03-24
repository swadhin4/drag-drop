eatSafeApp.controller('dropController',
		[
		'$scope',
		'$rootScope',
		'filterFilter',
		'csvService',
		'eatSafeService',
	function($scope, $rootScope, filterFilter, csvService, eatSafeService) {
		$scope.test = "hello";
		$scope.csvFile = "";
		var mobileView = 992;
		$scope.csvContent="";
		$scope.csvData={};
		$scope.csvHeaders = [];
		$scope.csvColDbColMap = [];
		$scope.selectedMap=[];
		$scope.selectedCSV=[];
		$scope.csvData.records=0;
		var mappedArray=[];
		angular.element(document).ready(function() {
			$scope.csvColDbColMap=[];
			$scope.dbColsArray=[];
			if($scope.dataLoaded==null){
				$.jStorage.set('fileselected', null);
			}
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
			 var headers = allTextLines[0].toLowerCase().split(',');
			 $scope.csvHeaders=headers;
			 $scope.csvData.header=headers;
			 csvService.CSV2JSON(contents)
			 .then(function(data){
				 $scope.csvContent = data; 
				$scope.getContents();
				$scope.getDBColumns("EST");
			 },function(data){
				 console.log(data);
			 });
		}
		
		$scope.getDBColumns=function(est){
			eatSafeService.getDbColumns(est).then(function(response){
				console.log(response);
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
			console.log($scope.csvData.rowObj);
		}
		
		
		$scope.saveData=function(){
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
		
		

		$scope.saveData=function(){
			console.log("Inside saveData "+ new Date())
			var finalArr=[];
			$.each($scope.csvData.rowObj,function(key,val){
				var establishment={};
				$.each(val.obj,function(k,v){
					establishment[$scope.finalMappedArr[k]]=v.v;
				});
				finalArr.push(establishment)
			});
			$scope.dataLoaded=finalArr;
			console.log(finalArr);
			eatSafeService.saveCsvData(finalArr, "EST").then(function(response){
				console.log(response);
				 console.log("Exit saveCSVData "+ new Date())
			},function(response){
				console.log(response);
			});
		}
		
		
		 $scope.pageChangeHandler = function(num) {
		      console.log('meals page changed to ' + num);
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
								   val.objvallist=[];
									$.each($scope.dataLoaded,function(key,val){
										for(k in val){
											if(k.toLowerCase() == csvIndexVal.toLowerCase()){
												 val.objvallist.push(val);
												break;
											}
										}
									});
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
					$scope.csvDbMap.objvallist=[];
					$.each($scope.dataLoaded,function(key,val){
						for(k in val){
							if(k.toLowerCase() == csvIndexVal.toLowerCase()){
								$scope.csvDbMap.objvallist.push(val);
								break;
							}
						}
					});
					$scope.csvColDbColMap.push($scope.csvDbMap);
					$('#csvSelect'+csvIndex).removeAttr("style");
				}
			}
			if(isValueExist){
				return false;
			}
			console.log($scope.csvColDbColMap);
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
		
		$scope.getCSVDBMap=function(){
			 console.log("Inside getCSVDBMap "+ new Date())
			$scope.saveData();
			/* var mappedArray=[];
				 for(var i=0;i<$scope.dataLoaded.length;i++){
					 var colObject={};
			 		 var arr=[];
			 		 arr.push($scope.dataLoaded[i]);
			 		 $.each($scope.csvColDbColMap,function(key,val){
						 var ar=[];
						 ar.push(val);
						 var keyMapArr = alasql('SELECT csvcol,dbcol FROM ? ', [ar]);
						 var valArr = alasql('SELECT '+keyMapArr[0].csvcol+' FROM ? ', [arr]);
						 var mappedValue="";
				 		 for(k in valArr[0]){
				 			mappedValue=valArr[0][k];
				 		 }
				 		 colObject[keyMapArr[0].dbcol]=mappedValue;
			 		 });
					 mappedArray.push(colObject);
				 }*/
				 //console.log(mappedArray);
				 var CsvDBColMapData={
							dataType:"Establishment",
							establishmentList:$scope.dataLoaded,
							csvDbColsList:JSON.stringify($scope.csvColDbColMap)
							
					}
				/* var CsvDBColMapData={
							dataType:"Establishment",
							//establishmentList:$scope.dataLoaded,
							establishmentMappedList:mappedArray,
							csvDbColsList:JSON.stringify(mappedArray)
							
					}*/
				 console.log(CsvDBColMapData);
				 eatSafeService.saveMapData(CsvDBColMapData).then(function(response){
						console.log(response);
						
					},function(response){
						console.log(response);
					});
		}  
		 
		$scope.finalMappedArr=[$scope.csvHeaders.length];
		
		$scope.populatedDataMap=function(dbColumnIndex, dbColumnVal, csvIndex, csvIndexVal ){
			var index = $.inArray(dbColumnVal.toLowerCase(), $scope.finalMappedArr);
			if(index == -1){
				$('#mappedCol'+csvIndex).text(dbColumnVal);
				$scope.finalMappedArr[$scope.csvHeaders.indexOf(csvIndexVal)]=$('#mappedCol'+csvIndex).text();
			}
			else{
				$('#mappedCol'+csvIndex).text(dbColumnVal);
				$scope.finalMappedArr[$scope.csvHeaders.indexOf(csvIndexVal)]=$('#mappedCol'+csvIndex).text();
			}
			$scope.checkDuplicateValue(csvIndexVal);
			console.log($scope.finalMappedArr);
		}
} ]);

