import * as vscode from 'vscode';
import { CFHandler } from './cf_handler';
import { setFlagsFromString } from 'v8';

export class RunHandler {
    private _terminal: vscode.Terminal | null;
    private _python_args: string | undefined;
    private _file_args: string | undefined;
    // first array elemnt holds python args, second element hold file args
    private _map_args: Map<string, string | undefined>;
    private _cfhandler: CFHandler;

    constructor() {
        this._terminal = null;
        this._python_args = undefined;
        this._file_args = undefined;
        this._map_args = new Map();
        this._cfhandler = new CFHandler();
    }

    public set_python_args(args: string | undefined) {
        this._python_args = args;
    }

    public set_file_args(args: string | undefined) {
        this._file_args = args;
    }

    public run_file_args() {
        // get active file and check if it is python file
        let { file, valid } = this.get_current_python_file();

        if (valid) {
            this._map_args.set(String(file), this._file_args);

            this.run(String(file));

            if (!this._file_args) {
                // clear from cached args if all arguments are undefined
                this._map_args.delete(String(file));
            }
        }

        this._file_args = undefined;
    }

    public run_file() {
        // get active file and check if it is python file
        let { file, valid } = this.get_current_python_file();

        // if arguments are chached use those
        if (valid && this._map_args.has(String(file))) {
            // restore arguments
            this._file_args = this._map_args.get(String(file));
        }

        if (valid) {
            this.run(String(file));
        }

        this._file_args = undefined;
    }

    private async run(file: string) {
        let cmd = this.create_cmd(String(file));

        if (this._terminal === null) {
            await this.create_new_terminal();
        }

        if (this._terminal !== null) {
            this._terminal.show();
            this._terminal.sendText(cmd);
            this._cfhandler.add_proposal(file);
        }
    }

    private async create_new_terminal() {
        this._terminal = vscode.window.createTerminal("PyRun");
        await new Promise(resolve => setTimeout(resolve, 2000));
        vscode.window.showInformationMessage(`If your python environment 
            was not activated automatically, please activate it manually.`);
    }


    public get_current_python_file() {
        let file_path = this._cfhandler.get_current_file()
        // check if current file is valid
        if (!file_path) {
            let actEditor = vscode.window.activeTextEditor;
            if (actEditor) {
                file_path = actEditor.document.fileName;
                if (file_path) {
                    let file_ext = file_path.split('.').pop();
                    if (file_ext === "py") {
                        return { file: file_path, valid: true };
                    } else {
                        vscode.window.showErrorMessage("PyRun: File needs to be a python file.");
                        return { file: file_path, valid: false };
                    }
                } else {
                    vscode.window.showErrorMessage("PyRun: No file selected.");
                    return { file: undefined, valid: false };
                }
            } else {
                // Display a message box to the user
                vscode.window.showErrorMessage("PyRun: No active file selected.");
                return { file: undefined, valid: false };
            }
        } else {
            return { file: file_path, valid: true };
        }
    }

    public create_cmd(file: string): string {
        var cmd = "python";
        if (this._python_args) {
            cmd = cmd + " " + String(this._python_args);
        }
        cmd = cmd + " " + file;
        if (this._file_args) {
            cmd = cmd + " " + String(this._file_args);
        }
        return cmd;
    }

    /*
    * Interface to current file handler
    */
    public get_status_bar_item(): vscode.StatusBarItem {
        return this._cfhandler.get_status_bar_item();
    }

    public get_proposals(): Array<string> {
        return this._cfhandler.get_proposals();
    }

    public select_current_file(file: string) {
        this._cfhandler.set_current_file(file);
    }

    public remove_file_proposal(file: string) {
        this._cfhandler.remove_proposal(file);
    }
}