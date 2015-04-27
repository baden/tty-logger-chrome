/* global angular:true, escape:true, unescape:true */

'use strict';

angular.module('services.serial', [])

.factory('Serial', ['$rootScope', '$q', function($rootScope, $q) {


    var serial = chrome.serial;

    /* Interprets an ArrayBuffer as UTF-8 encoded string data. */
    var ab2str = function(buf) {
        var bufView = new Uint8Array(buf);
        // console.log(['bufView=', bufView]);
        var encodedString = String.fromCharCode.apply(null, bufView);
        // console.log(['encodedString=', encodedString]);
        return encodedString;
        // return decodeURIComponent(escape(encodedString));
    };

    /* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
    var str2ab = function(str) {
        var encodedString = unescape(encodeURIComponent(str));
        var bytes = new Uint8Array(encodedString.length);
        for (var i = 0; i < encodedString.length; ++i) {
            bytes[i] = encodedString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    var SerialConnection = function() {
        this.connectionId = -1;
        this.lineBuffer = '';
        this.boundOnReceive = this.onReceive.bind(this);
        this.boundOnReceiveError = this.onReceiveError.bind(this);
        this.onConnect = new chrome.Event();
        this.onReadLine = new chrome.Event();
        this.onError = new chrome.Event();
    };

    SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
        // console.log('onConnectComplete(', connectionInfo);
        if (!connectionInfo) {
            // console.log('Connection failed.');
            return;
        }
        this.connectionId = connectionInfo.connectionId;
        chrome.serial.onReceive.addListener(this.boundOnReceive);
        chrome.serial.onReceiveError.addListener(this.boundOnReceiveError);
        this.onConnect.dispatch();
    };

    SerialConnection.prototype.onReceive = function(receiveInfo) {
        if (receiveInfo.connectionId !== this.connectionId) {
            return;
        }

        // console.log(['receiveInfo.data=', receiveInfo.data]);
        this.lineBuffer += ab2str(receiveInfo.data);
        // console.log(['this.lineBuffer=', this.lineBuffer]);

        var index;
        while ((index = this.lineBuffer.indexOf('\r')) >= 0) {
            var line;
            if(this.lineBuffer.substr(0, 1) === '\n') {
                line = this.lineBuffer.substr(1, index-1);
            } else {
                line = this.lineBuffer.substr(0, index);
            }
            this.lineBuffer = this.lineBuffer.substr(index + 1);

            if(line.length > 0) {
                // this.onReadLine.dispatch(line);
                this.onReadLine.dispatch(decodeURIComponent(escape(line)));
            }
        }
    };

    SerialConnection.prototype.onReceiveError = function(errorInfo) {
        if (errorInfo.connectionId === this.connectionId) {
            this.onError.dispatch(errorInfo.error);
        }
    };

    SerialConnection.prototype.connect = function(path, bitrate) {
        // console.log('SerialConnection.connect', serial);
        serial.connect(path, {bitrate: bitrate}, this.onConnectComplete.bind(this));
    };

    SerialConnection.prototype.send = function(msg) {
        if (this.connectionId < 0) {
            throw 'Invalid connection';
        }
        serial.send(this.connectionId, str2ab(msg), function() {});
    };

    SerialConnection.prototype.disconnect = function() {
        if (this.connectionId < 0) {
            throw 'Invalid connection';
        }
        serial.disconnect(this.connectionId, function() {});
    };


    var service = {
        scope: $rootScope.$new(true)
    };

    service.getDevices = function() {
        var defer = $q.defer();

        var onGetDevices = function(ports) {
            var data = [];
            for (var i=0; i<ports.length; i++) {
                data.push({
                    path: ports[i].path,
                    name: ports[i].path + ' : ' + ports[i].displayName
                });
                // console.log(ports[i]);
            }
            defer.resolve(data);
        };
        serial.getDevices(onGetDevices);

        return defer.promise;
    };

    service.SerialConnection = SerialConnection;


    return service;

}]);
