'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('main.html', {
        id: 'TTY_Logger_Chrome_WindowID',
        bounds: {
            width: 1024,
            height: 600
        },
        minWidth: 500,
        minHeight: 300
    });
});
