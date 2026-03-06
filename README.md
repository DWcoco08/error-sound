# Terminal Roast!

VS Code doesn't play any sound when a terminal command fails — this extension changes that! Automatically plays a sound effect when your terminal command returns an error. Choose from a variety of built-in sound effects to make your debugging experience more fun and noticeable.

## Features

- Automatically detects terminal command errors (non-zero exit code)
- Plays a sound effect when a command fails
- Choose from built-in sounds: **Bruh!**, **Fahhhh!**, **Mixi!**, **Bonk!**
- Works on both Windows and Linux
- Toggle on/off anytime

## Commands

- `Terminal Roast: Select Error Sound` — Pick your favorite error sound
- `Terminal Roast: Toggle On/Off` — Enable or disable the extension

## Extension Settings

- `terminalRoast.enabled` — Enable/disable error sound (default: `true`)
- `terminalRoast.sound` — Choose which sound to play (`bruh`, `fahhhh`, `mixi`, `bonk`)

## Requirements

- **Linux**: `mpg123`, `ffplay`, or `aplay` installed for audio playback
- **Windows**: No additional requirements

## Release Notes

### 0.0.1

Initial release with 4 built-in sound effects.
