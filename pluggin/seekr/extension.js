import dotenv from "dotenv";
dotenv.config();

import {
    connectWebSocket
} from "./connectWS";
import {
    showRoomVerificationPopup
} from "./verifyRoom";
import {
    sendTREE
} from "./tree";
const vscode = require("vscode");
const path = require("path");
const axios = require("axios");

// This method is called when your extension is activated
function activate() {
    //verification of the room!
    const res = showRoomVerificationPopup();
    if (res == 0) {
        vscode.window.showErrorMessage("Details NOT found!");
        return;
    }
    const ws = connectWebSocket();
    console.log(ws);
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100,
    );
    statusBarItem.text = "$(radio-tower) active";
    statusBarItem.tooltip = "seekr is running!";
    statusBarItem.show();
}

function tree() {
    const disposable = vscode.commands.registerCommand(
        "seekr.tree",
        async function() {
            const tree = await sendTREE();
            try {
                let workspace;
                if (vscode.workspace.workspaceFolders) {
                    workspace = vscode.workspace.workspaceFolders[0];
                }
                const rootPath = workspace.uri.fsPath;

                await axios.post(process.env.TREE, {
                    root: path.basename(rootPath),
                    tree,
                });

                vscode.window.showInformationMessage(
                    `Sent tree structure (${tree.length} nodes)`,
                );

                console.log("Congratulations, your tree is sent");
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to send tree: ${err.message}`);
            }
        },
    );
    context.subscriptions.push(disposable);
}

function hello() {
    const disposable = vscode.commands.registerCommand(
        "seekr.hello",
        async function() {
            vscode.showInformationMessage("seekr is active!");
        })
    context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() {
    console.log('seekr" is now deactivated!');
    vscode.window.showInformationMessage("deactivated!");
}

module.exports = {
    activate,
    deactivate,
    tree,
    hello,
};