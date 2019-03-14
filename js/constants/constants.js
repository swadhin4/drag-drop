angular.module('eatSafeApp').constant('config', {
    apiUrl: 'http://localhost:8383/drag-drop',
    baseUrl: '/',
    enableDebug: true
});

angular.module('eatSafeApp').constant('api', {
	getDBColumnList:'http://localhost:8585/eatsafe/service/api/v1/establishment/columns',
    saveEstablishment:'http://localhost:8585/eatsafe/service/api/v1/establishment',
    saveMapData:'http://localhost:8585/eatsafe/service/api/v1/mapdata',
    //saveInspection:'http://localhost:8585/eatsafe/service/api/v1/inspection',
    //getEstablishments:'http://localhost:8585/eatsafe/service/api/v1/establishments',
    //getInspections:'http://localhost:8585/eatsafe/service/api/v1/inspections',	
});