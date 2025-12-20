const ignore = require('ignore');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const {
    glob
} = require('glob');


async function sendTREE() {
    const workspace = vscode.workspace.workspaceFolders[0];
    if (!workspace) {
        vscode.window.showErrorMessage('No workspace open');
        return;
    }
    const rootPath = workspace.uri.fsPath;
    const ig = ignore();
    const gitignorePath = path.join(rootPath, '.gitignore');

    if (fs.existsSync(gitignorePath)) {
        ig.add(fs.readFileSync(gitignorePath, 'utf8'));
    }
    ig.add('.git');

    // reading the whole file path and ignoring the .git and all inside .gitignore
    const entries = await glob('**/*', {
        cwd: rootPath,
        dot: true,
        nodir: false
    });

    const tree = [];

    for (const entry of entries) {
        if (ig.ignores(entry)) continue;

        const fullPath = path.join(rootPath, entry);
        const stat = fs.statSync(fullPath);

        tree.push({
            type: stat.isDirectory() ? 'dir' : 'file',
            path: entry
        });
    }

    return tree;
}


module.exports = {
    sendTREE
};