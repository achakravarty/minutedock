define(['modules/app'] , function (app) {
  app.service('entriesService',['$http',function($http){
  	var getLastDate = function(date) {
  		var year = date.getFullYear(), month = date.getMonth();
  		return new Date(year, month + 1, 0);
  	};
  	var formatDate = function(date) {
      var actualMonth = date.getMonth() + 1;
  		return date.getDate() + "/" + actualMonth + "/" + date.getFullYear();
  	};

  	this.getEntries = function(month, year, callback) {
  		var firstDate = new Date(year, month - 1, 1);
  		var from = formatDate(firstDate); 
  		var to = formatDate(getLastDate(firstDate));
      return $http.get("/entries?from=" + from + "&to=" + to);
  	};

  }]);
});