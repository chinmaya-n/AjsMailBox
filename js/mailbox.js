"use strict";

var mailbox = angular.module("mailbox", ["ui.bootstrap"]);

mailbox.controller("mails", ["$scope", "$http", "$log", "$filter", function ($scope, $http, $log, $filter) {

  // mail variables
  $scope.mailsFound = false;
  $scope.mailList = [];

  // load mail data from json file
  $http.get("./js/mock_rp_data.json")
    .then(function (response) {
      $scope.mails = response.data;
      $scope.searchResult = $scope.mails;

      // pagination
      $scope.maxPaginationSize = 5;
      $scope.mailsPerPage = 10;
      $scope.currentPage = 1;
      $scope.mailsFound = true;
      $scope.totalMails = $scope.searchResult.length;
      
      // note all different folders
      var item;
      var folders = new Set();
      for (item in response.data) {
        folders.add(response.data[item].folder);
      }
      $scope.folders = Array.from(folders);
    
      // fill mails data when loaded
      $scope.getMailsForPage(1);
    });

  // watch the searchResult length to update mail display
//  $scope.$watch(function() { if ($scope.mailsFound) {$scope.searchResult.length;}; },
//                function(newLen) { $scope.totalMails = newLen; },
//                true);
  
  // paginate mails
  $scope.getMailsForPage = function (pageNo) {
    if ($scope.mailsFound) {
      var startMail = (pageNo - 1) * $scope.mailsPerPage;
      var endMail = startMail + $scope.mailsPerPage;
      $scope.mailList = $scope.searchResult.slice(startMail, endMail);
      $scope.setPage(pageNo);
    }
  };

  // set page
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  // set mails per page
  $scope.setMailsPerPage = function (num) {
    $scope.mailsPerPage = num;
    $scope.setPage(1);
    $scope.getMailsForPage($scope.currentPage);
  };

  // Search - get result / update the data
  $scope.getSearchResult = function () {
    if ($scope.mailsFound) {
      $scope.searchResult = $filter('filter')($scope.mails, $scope.searchText);
      $scope.totalMails = $scope.searchResult.length;
      $scope.setMailsPerPage(10);
    }
  };
  
  // Search - get [un]organized/both mails
  $scope.getOrganizedMails = function (flag) {
    if ($scope.mailsFound) {
      if (flag !== 'both')
        $scope.searchResult = $filter('filter')($scope.mails, {"organize":flag});
      else
        $scope.searchResult = $filter('filter')($scope.mails, {});
      $scope.totalMails = $scope.searchResult.length;
      $scope.searchText = "";
      $scope.setMailsPerPage(10);
    }
  };
  
  // Organize to new folder
  $scope.organizeFolder = function (mail) {
    var findQuery = {
		"sender": mail.sender,
		"domain": mail.domain,
		"email": mail.email
	};
    var findResult = $filter('filter')($scope.mails, findQuery);
    if (findResult.length == 1) {
      var id = $scope.mails.indexOf(findResult[0]);
      $scope.mails[id] = mail;
    }
  };
}]);