/* global angular:true, $:true */

'use strict';

angular.module('services.logger', [])

.factory('Logger', ['$rootScope', function($rootScope) {

    var Logger = function() {
        this.lastdatetime = new Date();
        this.onAddLine = new chrome.Event();
        this.data = [];
    };

    Logger.prototype.append = function(sender, text) {
        var datetime = new Date();
        var delta = (datetime - this.lastdatetime) / 1000;
        this.lastdatetime = datetime;
        this.onAddLine.dispatch(sender, datetime, delta, text);
        this.data.push({
            sender: sender,
            datetime: datetime,
            delta: delta,
            text: text
        });
    };


    Logger.prototype.filter = function(text, options) {
        console.log('Logger.prototype.filter', text, options);
    };

    var service = {
        scope: $rootScope.$new(true)
    };

    service.logger = Logger;

    service.setSenderColor = function(sender, color) {
        var $ss = $.stylesheet('p.sender' + sender);
        $ss.css('color', color);
    };

    function rgb2hex(rgb){
        if(angular.isUndefined(rgb)) {
            return '#000000';
        }
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if(rgb) {
            return '#' +
                ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ('0' + parseInt(rgb[3],10).toString(16)).slice(-2);
        } else {
            return '#000000';
        }
    }

    service.getSenderColor = function(sender) {
        var $ss = $.stylesheet('p.sender' + sender);
        var color = $ss.css('color');

        var computed = rgb2hex(color);

        return computed;
    };

    return service;
}]);
