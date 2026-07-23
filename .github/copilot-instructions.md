# Senior Architect & Developer Skills - Copilot Instructions

## Code Quality Standards

When generating code, always follow these principles:

### Naming

- Use descriptive `camelCase` for variables and functions
- Use `PascalCase` for classes, interfaces, and types
- Use `UPPER_SNAKE_CASE` for constants
- Avoid abbreviations unless universally understood

### Error Handling

- Define custom error classes extending Error
- Use typed catch clauses where possible
- Never swallow errors silently
- Log errors with context, not secrets

### Structure

- One responsibility per function
- Keep functions under 30 lines
- Use early returns to reduce nesting
- Extract magic numbers into named constants

## Architecture Patterns

### Clean Architecture

- Dependencies flow inward only
- Domain layer has no framework imports
- Use cases orchestrate business logic
- Repositories abstract data access
- Controllers handle HTTP concerns only

### Performance

- Prefer O(n) algorithms over O(n²)
- Use `Promise.all` for independent async operations
- Cache expensive computations with memoization
- Batch database queries to avoid N+1

## Testing Standards

- Write tests alongside implementation code
- Use descriptive test names (should...when...)
- Mock external dependencies
- Cover happy paths, error cases, and edge cases
