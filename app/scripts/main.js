/* global angular:true, $:true */

'use strict';

angular.module('app', ['directives', 'services']);

angular.module('app').controller('AppCtrl', ['$scope', '$timeout', 'Serial', 'Logger',
    function($scope, $timeout, Serial, Logger) {

        $scope.ports = [];

        $scope.connected = false;

        $scope.logger = new Logger.logger();

        var resizeLogger = function(){
            $timeout(function(){
                var toolheight = $('#tools')[0].clientHeight;
                $('.logcontainer').css('top', '' + toolheight + 'px');
            });
        };
        resizeLogger();

        $scope.onAddPort = function(){
            $scope.ports.push({});
            resizeLogger();
        };

        $scope.onRemovePort = function(index){
            $scope.ports.splice(index, 1);
            resizeLogger();
        };

        $scope.onConnect = function(port){
            var connection = new Serial.SerialConnection();
            connection.onConnect.addListener(function() {
                $scope.$apply(function(){
                    port.connected = true;
                    $scope.onDisconnect = function(){
                        connection.disconnect();
                        port.connected = false;
                    };
                });
            });

            connection.onReadLine.addListener(function(line) {
                $scope.logger.append(port.id, line);
            });

            connection.connect(port.port, port.boudrate * 1);
        };

        $scope.onTest = function(){
            $scope.logger.append('label', '===========================================', '#007f00');
        };

    }
]);
