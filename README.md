# Development Environment Settings

This repository contains my personal development environment settings and configurations.

## Contents

### VS Code Settings
- Personal editor preferences
- Terminal settings
- Workbench settings
- Git settings
- TypeScript settings

### TypeScript Configuration
- Base TypeScript configuration template
- Common compiler options
- Path aliases setup

## Usage

### VS Code Settings
1. Copy the contents of `vscode/settings.json` to your VS Code user settings
2. Install recommended extensions:
   ```bash
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension EditorConfig.EditorConfig
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension PKief.material-icon-theme
   ```

### TypeScript Configuration
1. Copy `typescript/tsconfig.base.json` to your project
2. Extend it in your project's `tsconfig.json`:
   ```json
   {
     "extends": "./tsconfig.base.json",
     "compilerOptions": {
       // Project-specific options
     }
   }
   ```

## Setting Up a New Machine

1. Clone this repository:
   ```bash
   git clone https://github.com/Asukarelsa/dev-settings.git
   ```

2. Copy VS Code settings to the appropriate location:
   ```bash
   # For Linux
   cp dev-settings/vscode/settings.json ~/.config/Code/User/settings.json

   # For macOS
   cp dev-settings/vscode/settings.json ~/Library/Application\ Support/Code/User/settings.json

   # For Windows
   cp dev-settings/vscode/settings.json %APPDATA%\Code\User\settings.json
   ```

3. Install recommended VS Code extensions:
   ```bash
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension EditorConfig.EditorConfig
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension PKief.material-icon-theme
   ```

4. For new TypeScript projects, copy the base configuration:
   ```bash
   cp dev-settings/typescript/tsconfig.base.json ./tsconfig.json
   ```

## Recommended Fonts
- FiraCode Nerd Font
- Cascadia Code

## License
ISC
