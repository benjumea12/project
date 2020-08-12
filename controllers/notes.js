angular.module("NotesApp")

.factory("NoteService", ($http, $localStorage,$rootScope) => {
    var noteService = {};
    const url = `${$rootScope.urlServer}/notes`

    // Method to search notes
    noteService.getNotes = function () {
        const idUser = $localStorage.userAppNotes._id.$oid

        return new Promise(function(resolve, reject) { 
            $http.get(`${url}/${idUser}`)
            .then(function successCallback(response) {
                resolve(response.data[0].notes)
            })
        })
    }

    // Method to create note
    noteService.newNote = function (note) {
        const idUser = $localStorage.userAppNotes._id.$oid
        
        var formData = new FormData();
        formData.append("title", note.title);
        formData.append("text", note.text);
        formData.append("color", note.color);
        formData.append("archive", note.archive);

        return new Promise(function(resolve, reject) { 
            $http.post(`${url}/new/${idUser}`, formData, {
                headers: {'Content-Type': undefined}
            })
            .then(function successCallback(response) {
                resolve(response.data)
            })
        })
    }

    // Method to delete notes
    noteService.deleteNote = function (note) {
        const idUser = $localStorage.userAppNotes._id.$oid
        const idNote = note._id.$oid

        return new Promise(function(resolve, reject) { 
            $http.delete(`${url}/delete/${idUser}/${idNote}`)
            .then(function successCallback(response) {
                resolve(response)
            })
        })
    }

    // Method to update note notes
    noteService.updateNote = function (note) {
        const idUser = $localStorage.userAppNotes._id.$oid
        const idNote = note._id.$oid

        var formData = new FormData();
        formData.append("title", note.title);
        formData.append("text", note.text);
        formData.append("color", note.color);
        formData.append("archive", note.archive);

        return new Promise(function(resolve, reject) { 
            $http.post(`${url}/update/${idUser}/${idNote}`, formData, {
                headers: {'Content-Type': undefined}
            })
            .then(function successCallback(response) {
                resolve(response)
            })
        })
    }

    return noteService;
})

// Directive to change the color of elements
.directive('bgColor', function () {
    return function (scope,element,attrs) {
        attrs.$observe('bgColor', function (value) {
            element.css({
                'background-color': value
            })
        })
    }
})


// Controller
.controller('NotesController', function($scope, NoteService, $localStorage, $window) {
    $scope.editeNote = { open: false, key: -1, note: {} }
    $scope.newNote = { title: '', text: '', color: 'white', archive: false }
    $scope.notes = []
    $scope.loaders = {find: false, create: false, update: false}
    $scope.archive = false

    $scope.showArchive = function () {
        $scope.archive = true
    }

    $scope.hideArchive = function () {
        $scope.archive = false
    }

    //Session validation
    function validSession () {
        if(!$localStorage.userAppNotes) {
            $window.location.href = '#!'
        }
    }
    validSession()

    // Function to search notes
    $scope.get = function () {
        $scope.loaders.find = true

        NoteService.getNotes()
        .then(function(result) {
            $scope.$apply(function () {
                $scope.setNotes(result)
                $scope.loaders.find = false
            })
        })
    }
    $scope.get()

    // Function to update the $scope.notes
    $scope.setNotes = function (notes) {
        $scope.notes = notes
    }

    // Function to change color
    $scope.setColor = function (value) {
        $scope.newNote.color = value;
    }

    // Function to open modal to edit note
    $scope.openEditeNote = function (key, note) {
        $scope.editeNote.key = key;
        $scope.editeNote.note = note;
        $scope.editeNote.open = true;
    }

    // Function to create new note
    $scope.saveNote = function () {
        if ($scope.newNote.title !== '' || $scope.newNote.text !== ''){
            $scope.loaders.create = true
            $scope.newNote.archive = $scope.archive

            NoteService.newNote($scope.newNote)
            .then(function(result) {
                $scope.get()
                $scope.newNote = { title: '', text: '', color: 'white', archive: false }
                $scope.loaders.create = false
            })
        }
    }

    // Function to logout
    $scope.logOut = function () {
        $localStorage.userAppNotes = null
        validSession()
    }
})

.controller('EditNotesContoller', function($scope, NoteService){
    // Function to change the color of the note edit modal
    $scope.setEditColor = function (value) {
        $scope.editeNote.note.color = value;
    }

    // Delete note function
    $scope.deleteNote = function () {
        $scope.loaders.update = true

        NoteService.deleteNote( $scope.editeNote.note)
        .then(function(result) {
            $scope.get()
            $scope.editeNote.open = false
            $scope.editeNote.key = -1
            $scope.loaders.update = false
        })
    }

    // Note edit function
    $scope.updateNote = function () {
        $scope.loaders.update = true

        NoteService.updateNote($scope.editeNote.note)
        .then(function(result) {
            $scope.get()
            $scope.editeNote.open = false
            $scope.editeNote.key = -1
            $scope.loaders.update = false
        })
    }

    // Archive note function
    $scope.archiveNote = function () {
        $scope.editeNote.note.archive = true
        $scope.updateNote()
    }

    // Archive note function
    $scope.unarchiveNote = function () {
        $scope.editeNote.note.archive = false
        $scope.updateNote()
    }
})