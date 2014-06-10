/* global angular:true */

'use strict';


angular.module('directives.port', ['services.serial', 'services.logger'])

.directive('port', [
    'Logger',
    function(Logger) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/port.tpl.html',
            require: 'ngModel',
            scope: {
                sender: '=',
                ngModel: '=',
                onConnect: '&',
                onDisconnect: '&'
            },
            controller: [
                '$scope', 'Serial',
                function($scope, Serial){
                    $scope.ports = [];
                    // var uuid4 = UUIDjs.create();
                    // $scope.ngModel.id = uuid4.toString();
                    $scope.ngModel.id = $scope.sender;
                    $scope.ngModel.color = Logger.getSenderColor($scope.sender);
                    // $scope.ngModel.color = "rgb(127,0,0);";
                    $scope.ngModel.connected = false;
                    Serial.getDevices()
                        .then(function(devices){
                            $scope.ports = devices;
                        });
                    $scope.$watch('ngModel.color', function(){
                        // console.log('color is changed ', $scope.ngModel.color, ' for ', $scope.ngModel.id);
                        Logger.setSenderColor($scope.sender, $scope.ngModel.color);
                    });
                }
            ]
        };
    }
]);
