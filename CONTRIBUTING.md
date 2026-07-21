# Contributing

Thanks for your interest in contributing to Senior Architect Skills.

## How to Add a New Skill

1. Create a directory: `skills/<skill-name>/`
2. Add a `SKILL.md` file with frontmatter:

```markdown
---
name: <skill-name>
description: One-line description of what this skill does
---

# Skill Title

Use this skill when:

- Scenario 1
- Scenario 2
  ...
```

3. Include real-world code examples, best practices, and usage scenarios
4. Update the `mcp.skills` array in `package.json`
5. Run `npm run validate` to verify

## Guidelines

- Follow the existing SKILL.md format
- Use real-world code examples, not pseudocode
- Keep descriptions concise and action-oriented
- Document when to use the skill and when not to
- Maintain production-ready patterns throughout
