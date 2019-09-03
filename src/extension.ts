// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RunHandler } from "./run_handler";

var runHandler: RunHandler;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	runHandler = new RunHandler();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('PyRun Handler is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let run = vscode.commands.registerCommand(
		'extension.runPythonFile', async () => {
			runHandler.run_file();
		});

	let runArgs = vscode.commands.registerCommand(
		'extension.runPythonFileArgs', async () => {
			// Create a new input box for file args and run file
			let args_input = vscode.window.showInputBox();
			args_input.then(run_with_args);
		});

	let setPythonArgs = vscode.commands.registerCommand(
		'extension.setPythonArgs', async () => {
			// Create a new input box for python args
			let args_input = vscode.window.showInputBox();
			args_input.then(set_python_args);
		});

	let selectCurrentFile = vscode.commands.registerCommand(
		'extension.selectCurrentFile', async () => {
			let proposals = Object.assign([], runHandler.get_proposals());
			proposals.push("Current File");
			let quick_pick = vscode.window.showQuickPick(proposals);
			quick_pick.then(select_current_file);
		});

	let removeFileProposal = vscode.commands.registerCommand(
		'extension.removeFileProposal', async () => {
			let proposals = Object.assign([], runHandler.get_proposals());
			proposals.push("Remove All");
			let quick_pick = vscode.window.showQuickPick(proposals);
			quick_pick.then(remove_file_proposal);
		});

	context.subscriptions.push(run);
	context.subscriptions.push(runArgs);
	context.subscriptions.push(setPythonArgs);
	context.subscriptions.push(selectCurrentFile);
	context.subscriptions.push(removeFileProposal);
	context.subscriptions.push(runHandler.get_status_bar_item());
}

function set_python_args(python_args: string | undefined) {
	runHandler.set_python_args(python_args);
}

function run_with_args(file_args: string | undefined) {
	runHandler.set_file_args(file_args);
	runHandler.run_file_args();
}

function select_current_file(args: string | undefined) {
	if (args) {
		runHandler.select_current_file(args);
	}
}

function remove_file_proposal(args: string | undefined) {
	if (args) {
		runHandler.remove_file_proposal(args);
	}
}


// this method is called when your extension is deactivated
export function deactivate() { }
