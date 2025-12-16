# Contributing

Thanks for your interest in contributing to storybook-addon-story-html! We welcome bug reports, feature requests, and pull requests.

## Getting started

1. Fork the repository and create a branch from `main`.
2. Install dependencies:

```bash
pnpm install
```

3. Build and run Storybook locally while developing:

```bash
pnpm run build
pnpm run storybook
```

## Code style

- This project uses TypeScript, ESLint, and Prettier. Run the linters/formatters before submitting a PR.
- Keep changes minimal and focused to make review easier.

## Tests

- Add tests when adding or changing functionality.
- Run existing tests (if any) with the project's test command (see `package.json`).

## Commit messages

- Prefer readable, descriptive commits. Consider using Conventional Commits (e.g., `fix:`, `feat:`, `chore:`).

## Pull requests

When opening a PR, please include:

- A short summary of the change and the motivation.
- Any relevant screenshots or gifs for visual changes.
- References to related issues (if applicable).

Checklist for PRs:

- [ ] The PR follows the repository's code style.
- [ ] Relevant tests were added or updated.
- [ ] The changes are buildable (run `pnpm run build`).

## Issues

- Use the issue tracker to report bugs or request features.
- Provide a clear description, steps to reproduce, and expected vs actual behavior.

## Reviewing and merging

- Maintainers will review PRs and may request changes.
- Squash or rebase if requested by maintainers to keep history clear.

## Code of conduct

By participating you agree to follow the repository's conduct expectations. Be respectful and constructive.

Thank you for contributing!
