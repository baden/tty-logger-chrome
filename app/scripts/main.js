/* global angular:true, $:true */

'use strict';

angular.module('app', ['directives', 'services']);

angular.module('app').controller('AppCtrl', ['$scope', '$timeout', 'Serial', 'Logger',
    function($scope, $timeout, Serial, Logger) {

        $scope.ports = [];
        $scope.closing = false;

        $scope.connected = false;

        $scope.logger = new Logger.logger();

        var resizeLogger = function(){
            $timeout(function(){
                var toolheight = $('#tools')[0].clientHeight - 4;
                $('.logcontainer').css('top', '' + toolheight + 'px');
            }, 100);
        };
        resizeLogger();

        $scope.onAddPort = function(){
            $scope.ports.push({});
            resizeLogger();
        };

        $scope.onRemovePort = function(index){
            if($scope.ports[index].connected) {
                $scope.ports[index].connection.disconnect();
                $scope.logger.append('label', 'DISCONNECTED ' + $scope.ports[index].port, '#007f00');
            }
            $scope.ports.splice(index, 1);
            resizeLogger();
        };

        $scope.onConnect = function(port){
            //var connection = new Serial.SerialConnection();
            port.connection = new Serial.SerialConnection();
            port.connection.onConnect.addListener(function() {
                $scope.$apply(function(){
                    port.connected = true;
                    $scope.logger.append('label', 'CONNECTED to ' + port.port + ' at ' + port.boudrate, '#007f00');
                    // $scope.onDisconnect = function(){
                    //     connection.disconnect();
                    //     port.connected = false;
                    // };
                });
            });

            port.connection.onReadLine.addListener(function(line) {
                $scope.logger.append(port.id, line);
            });

            // port.connection.onDisonnect.addListener(function() {
            //     console.log('disconnected', port.connection);
            // });

            port.connection.connect(port.port, port.boudrate * 1);
        };

        $scope.onDisconnect = function(port){
            port.connection.disconnect();
            $scope.logger.append('label', 'DISCONNECTED ' + port.port, '#007f00');
            port.connected = false;
        };

        $scope.onTest = function(){
            $scope.logger.append('label', '===========================================', '#007f00');
        };

        $scope.onMinimize = function(){
            chrome.app.window.current().minimize();
        };

        $scope.fullscreen = false;
        $scope.onMaximize = function(){
            if($scope.fullscreen){
                chrome.app.window.current().restore();
                $scope.fullscreen = false;
            } else {
                chrome.app.window.current().fullscreen();
                $scope.fullscreen = true;
            }
        };

        // Catch restore by ESC pressing
        chrome.app.window.current().onRestored.addListener(function(){
            console.log('restored');
            $scope.fullscreen = false;
        });

        // window.onKeyDown = function(e) {
        //     console.log('onKeyDown', e);
        //     if(e.keyCode === 27) {    /* ESC */
        //         $scope.fullscreen = false;
        //         e.preventDefault();
        //     }
        // };

        $scope.onExit = function(){
            console.log('Exit');
            $scope.ports.forEach(function(port){
                if(port.connected) {
                    port.connection.disconnect();
                    port.connected = false;
                }
            });
            $scope.closing = true;
            $timeout(function(){
                window.close();
            }, 500);
        };
    }
]);
