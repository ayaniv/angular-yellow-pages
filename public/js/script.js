(function() {

	'use strict';

	angular.module('yellowPages', ['infinite-scroll'])
		.service('PeopleModel', peopleModel)
		.service('UtilsService', utilsService)
		.controller('YellowPagesCtrl', yellowPagesCtrl);

	function utilsService() {
		this.isPhoneNumber = function(phone) {
    		return (/\(?([0-9]{4})\)?([-]?)([0-9]{6})/).test(phone)
    	}

    	this.getAgeByDate = function(dateString)
    	{
    		return moment().diff(moment(dateString), 'years');
    	}

    	this.isNumeric = function(num){
		    return !isNaN(num)
		}
	}

	function peopleModel($http, $q, UtilsService) {
		var cached = null
		this.GetData =function() {
			if (cached) {
				return $q.when(cached);
			}
			return $http.get('/public/data/people.json').then(function(people) {
				cached = _.map(people.data, _mapPeople);
				return cached;
			});			
		}

		function _mapPeople(person) {
    		return {
    			id : person.id,
    			name : person.name,
    			age: UtilsService.getAgeByDate(person.birthday),
    			address: person.address.street + ", " + person.address.city + ", " + person.address.country,
    			phone: person.phone,
    			avatar: person.avatar_origin.replace('400x400', '40x40')
    		}
    	}
	}
		
	function yellowPagesCtrl($scope, PeopleModel, UtilsService) {
		var self = this;
		self.showSearchResults = false;
		self.inputString = null;
		var MAX_AGE = 120;

		var paging = {currentPage : 0, windowSize: 20, windowMargin : 200};
		var searchCriteria;

		self.GetData = function() {	
			self.isAjaxLoading = true;
			PeopleModel.GetData().then(successCallback, errorCallback);	
		};

    	function errorCallback(response) {
    		alert(response.data + "\nPlease read logs");
    		console.log(response)
    		self.isAjaxLoading = false;
    	}

    	function successCallback(people) {
    		var currPeopleResult = _.filter(people, _.conforms(searchCriteria));
			var currPeopleResultPage = currPeopleResult.slice(paging.currentPage * paging.windowSize, (paging.currentPage + 1) * paging.windowSize);
			updateScreen(self.currPeopleResult.concat(currPeopleResultPage));
			self.showSearchResults = true;
			paging.currentPage++;
    	}

    	function updateScreen(results) {
    		self.currPeopleResult = results ? results : [];
			self.isAjaxLoading = false;
			
    	}

    	function _getTypeByPrefix(prefix) {
    		
    		if (UtilsService.isPhoneNumber(prefix) || (UtilsService.isNumeric(prefix) && prefix > MAX_AGE)) {
    			return "phone";
    		}  else if (UtilsService.isNumeric(prefix)) {
    			return "age";
    		} else {
    			return "name";
    		}
    	}

    	function getPrefixesArray(inputData) {
			var prefix = inputData.trim();
			if (!prefix) {
				return null
			}
			return prefix.split(' ');
    	}

    	function getSearchCriteria(prefixesArray) {
			var searchCriteria = {};
    		if (prefixesArray) {
				_.forEach(prefixesArray, function(prefix) {
					var currFilterType = _getTypeByPrefix(prefix);
					searchCriteria[currFilterType] = createFunction(currFilterType, prefix);
				})
			}
			return searchCriteria;
    	}

    	function createFunction(type, value) {
    		var filterFunction;
    		value = value.toLowerCase().replace('-', '');
    		switch (type) {
    			case "name":
    				filterFunction = function(item) { return item.toLowerCase().includes(value); }
    				break;
    			case "age":
    				filterFunction = function(item) { return item == value; }
    				break;
    			case "phone":
    				filterFunction = function(item) { return item.replace('-', '').includes(value); }
    				break;
    		}
    		return filterFunction;
    	}

    	function performSearch(inputValue) {
    		paging.currentPage = 0;
    		var prefixesArray = getPrefixesArray(inputValue);
			searchCriteria = getSearchCriteria(prefixesArray);
			self.GetData();	
    	}
  
    	$scope.$watch(angular.bind(self, function () {
    		return self.inputString;
    	}), function (currInputValue) {
    		updateScreen();
    		if (currInputValue) {
    			performSearch(currInputValue);
    		}
    	});
	} 

})();	
	
