const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;
const dialog = remote.dialog;
const storage = require('electron-storage');
const path = require('path');


function orderObjectBy(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
}


function boot() {

	// Get logger instance and inject it in Angular
	const logger = remote.getGlobal('logger');
	angular
		.module('app')
		.value('logger', logger)
		.value('storage', storage)
		.value('dialog', dialog)
		.value('path', path)
		.filter('orderObjectBy', orderObjectBy)
		.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });

	angular.bootstrap(document, ['app'], {
		strictDi: true
	});
}

document.addEventListener('DOMContentLoaded', boot);

ipcRenderer.on('update-message', function(event, method) {
    alert(method);
});
