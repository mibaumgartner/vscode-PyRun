// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RunHandler } from "./handler";

var python_args: string | undefined = undefined;
var file_args: string | undefined = undefined;
var runHandler: RunHandler;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	runHandler = new RunHandler();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('PythonRun Handler is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let runPython = vscode.commands.registerCommand('extension.runPythonFile', async () => {
		runHandler.run_file();
	});

	let runPythonArgs = vscode.commands.registerCommand('extension.runPythonFileArgs', async () => {
		// Create a new input box for python args
		let pargs = vscode.window.showInputBox();
		pargs.then(set_python_args);
	});

	context.subscriptions.push(runPython);
	context.subscriptions.push(runPythonArgs);
}

function set_python_args(args: string | undefined) {
	python_args = args;
	let fargs = vscode.window.showInputBox();
	fargs.then(run_with_args);
}

function run_with_args(args: string | undefined) {
	file_args = args;
	runHandler.run_file_args(python_args, file_args);
}

// this method is called when your extension is deactivated
export function deactivate() { }
