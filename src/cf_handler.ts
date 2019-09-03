import * as vscode from 'vscode';
import * as path from 'path';
import { setFlagsFromString } from 'v8';


export class CFHandler {
    private _proposals: Array<string>;
    private _current_file: string | undefined;
    private _status_bar: vscode.StatusBarItem;

    constructor() {
        this._proposals = [];
        this._current_file = undefined;

        this._status_bar = vscode.window.createStatusBarItem();
        this._status_bar.command = "extension.selectCurrentFile";
        this._status_bar.tooltip = "Run specified python file.";
        this.update_status_bar("PyRun: Current File");
    }

    public get_status_bar_item(): vscode.StatusBarItem {
        return this._status_bar;
    }

    public set_current_file(file: string) {
        if (file === "Current File") {
            this._current_file = undefined;
            this.update_status_bar("PyRun: Current File");
        } else {
            this._current_file = file;
            this.update_status_bar("PyRun: " + path.basename(file));
        }
    }

    public get_current_file(): string | undefined {
        return this._current_file;
    }

    public get_proposals(): Array<string> {
        return this._proposals;
    }

    public add_proposal(file: string) {
        if (!this._proposals.includes(file)) {
            this._proposals.push(file);
        }
    }

    public remove_proposal(file: string) {
        if (file === "Remove All") {
            delete (this._proposals);
            this._proposals = [];
            this._current_file = undefined;
            this.update_status_bar("PyRun: Current File");
        } else {
            for (var i = 0; i < this._proposals.length; i++) {
                if (this._proposals[i] === file) {
                    this._proposals.splice(i, 1);
                }
            }

            if (this._current_file === file) {
                this._current_file = undefined;
                this.update_status_bar("PyRun: Current File");
            }
        }
    }

    private update_status_bar(msg: string) {
        this._status_bar.text = msg;
        this._status_bar.show();
    }
}