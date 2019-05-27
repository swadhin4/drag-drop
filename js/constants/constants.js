var eatSafeModule = angular.module('eatSafeApp').constant('config', {
    apiUrl: 'http://localhost:8383/restaurant-app',
    baseUrl: '/',
    enableDebug: true
});

eatSafeModule.constant('api', {
	getDBColumnList:'http://localhost:8585/eatsafe/service/api/v1/establishment/columns',
    saveEstablishment:'http://localhost:8585/eatsafe/service/api/v1/establishment',
    saveMapData:'http://localhost:8585/eatsafe/service/api/v1/mapdata',
    getRestaurantData:'http://localhost:8585/eatsafe/service/api/v1',
    getInspectionRules:'rules.json',
    saveInspectionForm:'http://localhost:8585/eatsafe/service/api/v1/inspection/save',
    getMyLocation:'https://api.opencagedata.com/geocode/v1/json'
});
