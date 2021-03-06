angular.module("NotesApp", ["ngStorage","ngRoute"])

.run(function ($rootScope) {
    $rootScope.urlServer = "https://38bb2edb1985.ngrok.io"
})

.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/login.html",
            controller: "LoginController"
        })
        .when("/notes", {
            templateUrl: "templates/notes.html",
            controller: "NotesController"
        })
})
