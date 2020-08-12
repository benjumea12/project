angular.module("NotesApp")

.factory("LoginService", ($http,$rootScope) => {
    var loginService = {}
    const url = `${$rootScope.urlServer}/login`

    loginService.getUser = function (username, password) {
        return new Promise(function(resolve, reject) { $http({
                method: 'GET',
                url: url+`/${username}/${password}`
            }).then(function successCallback(response) {
                resolve(response.data)
            })
        })
    }

    return loginService;
})

.controller("LoginController", function($scope, $localStorage, LoginService, $window) {
    $scope.username = ''
    $scope.password = ''
    $scope.loaders = {login: false, nofound: false}

    if($localStorage.userAppNotes) {
        $window.location.href = '#!notes'
    }

    $scope.sendForm = function () {
        $scope.loaders.login = true 

        if ($scope.username !== '' && $scope.password !== ''){
            LoginService.getUser($scope.username, $scope.password)
            .then(function(result) {
                $scope.$apply(function () {
                    $scope.loaders.login = false

                    if (Array.isArray(result) && result.length > 0) {
                        $localStorage.userAppNotes = result[0]
                        $window.location.href = '#!notes'
                    } else {
                        $scope.loaders.nofound = true
                    }
                })
            })
        }   
    } 
})