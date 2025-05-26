# Claude Code Instructions

## Overview
This project follows specific coding standards and conventions defined in the `.cursor/rules` directory. All code contributions must adhere to these guidelines.

## Important Rules

### Follow .cursor Rules
**IMPORTANT**: Always read and follow the rules defined in `.cursor/rules/` directory:
- `.cursor/rules/general.mdc` - General project guidelines
- `.cursor/rules/js.mdc` - JavaScript/TypeScript specific rules
- `.cursor/rules/monorepo.mdc` - Monorepo structure guidelines

These rules take precedence and must be followed for all code changes.

### Key Coding Standards

#### React Development
- Use `shadcn/ui` components instead of custom-styled UI elements
- Always import from `@/components/ui` for UI components
- Prefer arrow functions for components and callbacks
- Use `react-query` for data fetching (never fetch in useEffect)
- Use `lucide-react` for icons (no inline SVGs)
- Use `framer-motion` for animations

#### Error Handling
- Use `neverthrow` for error handling instead of bare try/catch blocks
- Handle errors explicitly at appropriate boundaries

#### TypeScript
- Use `ts-pattern` for exhaustive pattern matching
- Avoid `any` type - be explicit with types
- Prefer interfaces for object shapes

#### Code Quality
- Run `bun fmt` (or `bun run lint:fix && bun run format`) before committing
- Ensure all tests pass
- Keep functions pure when possible
- Use optional chaining (?.) and nullish coalescing (??)

## Project Structure
This is a monorepo using pnpm workspaces with:
- `/apps` - Application packages (web, cmd)
- `/packages` - Shared packages

## Development Commands
- `bun fmt` - Format and lint code
- `bun test` - Run tests
- `bun dev` - Start development server

## Before Making Changes
1. Read the relevant `.cursor/rules` files
2. Check existing code patterns in the codebase
3. Follow the established conventions
4. Run linting and formatting before committing

## Git Commit Policy
**IMPORTANT**: Do NOT make git commits automatically. Always wait for explicit user permission before committing any changes.