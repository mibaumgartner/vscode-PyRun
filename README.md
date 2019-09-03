# BETA: PyRun
PyRun is a visual studio code extensions which aims at improving productivity.
Currently, it serves two main purposes: easily run your python scripts with arguments and choose your execution file(by default the focussed file will be used).

The entered arguments are saved for the current file and can be executed in the next run by `PyRun: Run File` . To overwrite the saved arguments, just use `PyRun: Run File with Args` and do not enter any arguments.

The bottom menu can be used to select the execution file und displays the currently selected file.

## Installation
Installation is currently done by manually downloading and installing the extension. When the beta phase ends and the feedback is good, then extension will published to VS Code MarketPlace. 

Download the `pyrun-X.X.X.vsix` file (where X are the current version numbers) from https://drive.google.com/drive/folders/104DBLcp9rprn0wqJZyfOxwCgmIdQCpvV?usp=sharing and run `code --install-extension pyrun-X.X.X.vsix` from the terminal.
If your terminal does not recognize the `code` keyword, start vscode and run `Shell Comman: Install 'code' command in PATH` from the command pallet.

## Example for running a python file with arguments:
![Alt Text](./assets/run_args.gif)

## Choose your execution file:
![Alt Text](./assets/current_file.gif)

## BETA Note
This release is still highly experimental and only provides the aforementioned features.