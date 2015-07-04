/* global angular:true, $:true, d3:true */

'use strict';

angular.module('directives.logger', ['services.logger'])

.directive('logger', [
    function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/logger.tpl.html',
            scope: {
                logger: '='
            },
            link: function(scope, element){
                var container = element.find('pre.log');

                $(element).find('.dropdown-toggle').dropdown();

                $(element).find('.dropdown-menu').on('click', function(e) {
                    if($(this).hasClass('dropdown-menu-form')) {
                        e.stopPropagation();
                    }
                });

                // console.log('a=', a);

                scope.scroll = true;

                var timeformat = d3.time.format('%H:%M:%S');
                var deltaformat = d3.format('.3f');

                scope.logger.onAddLine.addListener(function(sender, datetime, delta, text){
		    var div = document.createElement(div);
		    div.textContent = text;

                    var prepared = '<p class="sender' + sender + '"><a></a><span class="datetime">' + timeformat(datetime) + '</span><span class="delta">' + deltaformat(delta) + '</span><span class="content">' + div.innerHTML + '</span></p>';

                    container.append(prepared);
                    if(scope.scroll) {
                        container.scrollTop(1e6);
                    }
                });

                scope.onClearLog = function(){
                    container.empty();
                };

                scope.onSave = function(){

                    var data = [];
                    container.find('p').each(function(index){
                        var item = $(this);
                        var classname = $(this).attr('class');
                        data.push(
                            '' + index +
                            '\t' + classname +
                            '\t' + item.find('span.datetime').text() +
                            '\t' + item.find('span.delta').text() +
                            '\t' + item.find('span.content').text() +
                            '\n'
                        );
                    });

                    var errorHandler = function(data){
                        console.log('errorHandler data=', data);
                    };

                    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                        console.log('saveFile', writableFileEntry);
                        writableFileEntry.createWriter(function(writer) {
                            writer.onerror = errorHandler;
                            writer.onwriteend = function(e) {
                                console.log('write complete e=', e);
                            };
                            writer.write(new Blob(data, {type: 'text/plain'}));
                        }, errorHandler);
                    });
	            };

                scope.search = {
                    type: 'string',
                    highlight: false,
                    save: false
                };

                scope.onSearch = function(){
                    console.log('TBD search=', scope.search);
                    scope.logger.filter(scope.search.text, scope.search);
                };

            }
        };
    }
]);
