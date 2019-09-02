import * as vscode from 'vscode';
import { CFHandler } from './cf_handler';

export class RunHandler {
    private _terminal: vscode.Terminal | null;
    private _python_args: string | undefined;
    private _file_args: string | undefined;
    // first array elemnt holds python args, second element hold file args
    private _map_args: Map<string, Array<string | undefined>>;
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

    public run_file_args(python_args: string | undefined, file_args: string | undefined) {
        // get active file and check if it is python file
        let { file, valid } = this.get_current_python_file();

        if (valid) {
            this.set_python_args(python_args);
            this.set_file_args(file_args);
            this._map_args.set(String(file), [this._python_args, this._file_args]);

            this.run(String(file));

            if (!this._python_args && !this._file_args) {
                // clear from cached args if all arguments are undefined
                this._map_args.delete(String(file));
            }
        }

        this._python_args = undefined;
        this._file_args = undefined;
    }

    public run_file() {
        // get active file and check if it is python file
        let { file, valid } = this.get_current_python_file();

        // if arguments are chached use those
        if (valid && this._map_args.has(String(file))) {
            // restore arguments
            let args = this._map_args.get(String(file));
            if (args) {
                this._file_args = args[1];
                this._python_args = args[0];
            }
        }

        if (valid) {
            this.run(String(file));
        }

        this._python_args = undefined;
        this._file_args = undefined;
    }

    private run(file: string) {
        let cmd = this.create_cmd(String(file));

        if (this._terminal === null) {
            this._terminal = vscode.window.createTerminal("PythonRunner");
        }
        this._terminal.show();
        this._terminal.sendText(cmd);
        this._cfhandler.add_proposal(file);
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
                        vscode.window.showErrorMessage("File needs to be a python file.");
                        return { file: file_path, valid: false };
                    }
                } else {
                    vscode.window.showErrorMessage("No file selected.");
                    return { file: undefined, valid: false };
                }
            } else {
                // Display a message box to the user
                vscode.window.showErrorMessage("No active file selected.");
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