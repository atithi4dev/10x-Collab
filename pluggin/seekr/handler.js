const vscode = require('vscode');

function handler(data) {
    // handle based on type
    switch (data.type) {
        case 'vid_call':
            vidcall_pop(data.msg);
            break;
        default:
            console.warn('unknown type:', data.type);
    }
}

function vidcall_pop(data) {
    vscode.window.showInformationMessage(
        'Video-Call initiated',
        'Join',
        'Dismiss'
    ).then(selection => {
        if (selection === 'Join') {
            console.log('join!');
            const url = vscode.Uri.parse(data);
            vscode.env.openExternal(url);
        } else if (selection === 'Dismiss') {
            console.log('User dismissed the popup.');
        }
    });
}

module.exports = {
    handler
};