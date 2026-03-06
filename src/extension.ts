import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';

const SOUNDS: Record<string, string> = {
	bruh: 'bruh.mp3',
	fahhhh: 'fahhhh.mp3',
	mixi: 'mixi.mp3',
};

let currentProcess: cp.ChildProcess | null = null;

function killCurrentSound() {
	if (currentProcess) {
		currentProcess.kill();
		currentProcess = null;
	}
}

function playSound(extensionPath: string, soundFile: string) {
	killCurrentSound();

	const soundPath = path.join(extensionPath, 'sounds', soundFile);
	const platform = process.platform;

	if (platform === 'win32') {
		currentProcess = cp.exec(
			`powershell -c "Add-Type -AssemblyName PresentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([Uri]'${soundPath}'); $p.Play(); Start-Sleep -Seconds 10"`,
		);
	} else {
		currentProcess = cp.exec(
			`mpg123 "${soundPath}" || ffplay -nodisp -autoexit "${soundPath}" || aplay "${soundPath}"`,
			(err) => {
				if (err && !err.killed) {
					currentProcess = cp.exec(`paplay "${soundPath}"`);
				}
			}
		);
	}

	currentProcess.on('exit', () => {
		currentProcess = null;
	});
}

export function activate(context: vscode.ExtensionContext) {
	const shellExecDisposable = vscode.window.onDidEndTerminalShellExecution((event) => {
		const config = vscode.workspace.getConfiguration('terminalRoast');
		const enabled = config.get<boolean>('enabled', true);

		if (!enabled) {
			return;
		}

		if (event.exitCode !== undefined && event.exitCode !== 0) {
			const soundKey = config.get<string>('sound', 'bruh');
			const soundFile = SOUNDS[soundKey] || SOUNDS['bruh'];
			playSound(context.extensionPath, soundFile);
		}
	});

	const selectSoundDisposable = vscode.commands.registerCommand('error-sound.selectSound', async () => {
		const items = [
			{ label: 'Bruh!', value: 'bruh' },
			{ label: 'Fahhhh!', value: 'fahhhh' },
			{ label: 'Mixi!', value: 'mixi' },
		];

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Choose your error sound',
		});

		if (selected) {
			const config = vscode.workspace.getConfiguration('terminalRoast');
			await config.update('sound', selected.value, vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage(`Terminal Roast: Sound set to ${selected.label}`);
		}
	});

	const toggleDisposable = vscode.commands.registerCommand('error-sound.toggle', async () => {
		const config = vscode.workspace.getConfiguration('terminalRoast');
		const enabled = config.get<boolean>('enabled', true);
		await config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
		vscode.window.showInformationMessage(`Terminal Roast: ${!enabled ? 'Enabled' : 'Disabled'}`);
	});

	context.subscriptions.push(shellExecDisposable, selectSoundDisposable, toggleDisposable);
}

export function deactivate() {
	killCurrentSound();
}
