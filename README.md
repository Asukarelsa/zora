# Zora

A TypeScript project with GraphQL WebSocket support.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- VS Code (recommended)

## Installation

```bash
# Install dependencies
npm install

# Set up Git hooks
npm run prepare
```

## VS Code Setup

This project includes VS Code workspace settings for optimal development experience. To get started:

1. Install the recommended VS Code extensions:
   ```bash
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension EditorConfig.EditorConfig
   code --install-extension ms-vscode.vscode-typescript-next
   ```

2. The workspace includes:
   - Editor settings for consistent formatting
   - TypeScript configuration
   - ESLint integration
   - Debug configurations
   - File exclusions

3. Personal VS Code settings (like font preferences) should be configured in your user settings.

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the project in development mode with hot reload
- `npm start` - Run the compiled project
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
  ├── index.ts        # Entry point
  └── ...            # Other source files
dist/                # Compiled output
```

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- Husky for Git hooks

## License

ISC
