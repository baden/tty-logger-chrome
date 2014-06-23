'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('main.html', {
        // id: 'TTY_Logger_Chrome_WindowID',
        // frame: 'none',
        bounds: {
            width: 1024,
            height: 600
        },
        frame: 'none',
        minWidth: 610,
        minHeight: 300
    });
});

chrome.app.window.onClosed.addListener(function() {
    console.log('EXIT===========================');
    //  chrome.serial.close(connectionId, onClose);
    //  chrome.runtime.reload();
});
