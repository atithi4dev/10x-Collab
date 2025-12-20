async function showRoomVerificationPopup() {
    try {
        //name
        const username = await vscode.window.showInputBox({
            placeHolder: 'Enter your name',
            prompt: 'Your display name for this room',
            validateInput: text => text ? null : 'Name cannot be empty'
        });

        if (!username) return; 

        //Room ID
        const roomId = await vscode.window.showInputBox({
            placeHolder: 'Enter Room ID',
            prompt: 'Unique room identifier',
            validateInput: text => text ? null : 'Room ID cannot be empty'
        });

        if (!roomId) return;

        //password
        const roomPass = await vscode.window.showInputBox({
            placeHolder: 'Enter Room Password',
            prompt: 'Room password (case-sensitive)',
            password: true, // hides input
            validateInput: text => text ? null : 'Password cannot be empty'
        });

        if (!roomPass) return;


        const res = await axios.post(                                       // expecting a result in 0/1
            process.env.ROOM_VERIFICATION,
            {
                username,
                roomId,
                roomPass
            });
        
            return res;

    } catch (err) {
        vscode.window.showErrorMessage('Error during room verification: ' + err.message);
        return null;
    }
    
}

module.exports = { showRoomVerificationPopup };
