// public/core.js
var payload = angular.module('payload', []);

function mainController($scope, $http) {
    $scope.formData = {};
    // when landing on the page, get all todos and show them
    $http.get('/invoice')
        .success(function (data) {
            if (data != 'null') {
                $scope.invoices = data;
            }
            else {
                $scope.invoices = {};
            }
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createInvoice = function () {
        $http.post('/invoice', $scope.formData)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.invoices = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
}
function ledgerController($scope, $http) {
    $scope.formData = {};
    // when landing on the page, get all todos and show them
    $http.get('/ledger')
        .success(function (data) {
            $scope.ledger = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
}
function transactionController($scope, $http) {
    $scope.formData = {};
    // when landing on the page, get all todos and show them
    $http.get('/transaction')
        .success(function (data) {
            $scope.ledger = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
}