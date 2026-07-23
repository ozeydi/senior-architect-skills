# 🏆 Senior Architect & Developer Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open_Source-Yes-brightgreen)](https://github.com/ozeydi/senior-architect-skills)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://github.com/microsoft/TypeScript)
<div align="center">

![Professional Standards](https://img.shields.io/badge/Standards-Production%20Ready-success)
![Best Practices](https://img.shields.io/badge/Best%20Practices-Enterprise%20Grade-blue)
![Performance](https://img.shields.io/badge/Performance-Optimized-red)

**A Comprehensive Collection of Professional Software Development Skills**

For Cursor, Copilot, Claude, ChatGPT, and any AI-powered development tool

</div>

---

## 📖 Introduction

This repository contains professionally curated software development skills designed for use across the most popular AI-powered development tools. Your source for production-ready code standards, clean architectural patterns, and performance optimization strategies.

### ✨ What Makes This Different?

- 🎯 **Industry Standards**: Following the same patterns used by top-tier software companies
- 🔒 **Security First**: Comprehensive security best practices included
- ⚡ **Performance Optimized**: Time and complexity optimization built-in
- 🏗️ **Clean Architecture**: Modern software architecture principles
- 📝 **Full Documentation**: Complete examples and explanations
- 🧪 **Test Ready**: Production-grade testing strategies included

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ozeydi/senior-architect-skills.git
cd senior-architect-skills

# Copy skills to your project (all you need)
cp -r skills/ /path/to/your/project/skills/

# Validate setup
node scripts/validate-skills.js
```

---

## 📚 Skills Overview

### 🏆 **Senior Developer Standard** (`senior-developer-standard`)

**Purpose**: Ensures production-ready code quality across all development tasks

**Key Features**:

- ✅ Professional naming conventions
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Complete documentation (JSDoc)
- ✅ Testing standards (70%+ coverage)
- ✅ Performance monitoring
- ✅ Configuration management
- ✅ API integration patterns

**Best For**: New feature development, code quality reviews, team standards enforcement

### 🏛️ **Clean Architecture** (`clean-architecture`)

**Purpose**: Professional system design with clear separation of concerns

**Key Features**:

- ✅ Dependency inversion principles
- ✅ Layered architecture patterns
- ✅ DDD domain-driven design
- ✅ Microservices boundaries
- ✅ Repository interfaces
- ✅ API design standards
- ✅ Event-driven architecture
- ✅ Module organization

**Best For**: Large systems, microservices design, complex applications

### ⚡ **Performance Optimization** (`performance-optimization`)

**Purpose**: Identifying and implementing performance improvements

**Key Features**:

- ✅ Code complexity optimization (target O(n))
- ✅ Caching strategies (memoization, TTL)
- ✅ Database query optimization
- ✅ Efficient data structures
- ✅ Memory management
- ✅ Async pattern optimization
- ✅ Web performance
- ✅ React/Vue performance

**Best For**: Performance reviews, bottlenecks identification, scaling projects

---

## 🛠️ Tool Integration

The `skills/` directory works with any AI coding tool. Tool-specific configs are also provided:

| Tool               | How to Use                                                            |
| ------------------ | --------------------------------------------------------------------- |
| **Any AI Tool**    | Copy `skills/` to your project -- SKILL.md files work everywhere      |
| **Claude**         | Copy `CLAUDE.md` to project root -- Claude reads it on every chat     |
| **ChatGPT**        | Paste the relevant `skills/*/SKILL.md` content into your conversation |
| **Cursor**         | Copy `.cursor/rules/cursor-skills.xml` into your project              |
| **GitHub Copilot** | Copy `.github/copilot-instructions.md` into your project              |
| **Cline**          | Copy `.cursor/cline-config.json` into your project                    |

---

## 📂 Installation

```bash
# Clone once
git clone https://github.com/ozeydi/senior-architect-skills.git
cd senior-architect-skills

# Option A: Copy skills to your project (recommended)
cp -r skills/ /path/to/your/project/skills/

# Option B: Copy tool-specific configs too
cp .cursor/rules/cursor-skills.xml /path/to/your/project/.cursor/rules/
cp .github/copilot-instructions.md /path/to/your/project/.github/
cp .cursor/claude-config.json /path/to/your/project/.cursor/
cp .cursor/cline-config.json /path/to/your/project/.cursor/
```

---

## 🎯 When to Use Each Skill

| Development Scenario           | Recommended Skill                              |
| ------------------------------ | ---------------------------------------------- |
| **New Feature Development**    | senior-developer-standard                      |
| **Code Quality Review**        | senior-developer-standard                      |
| **System Architecture Design** | clean-architecture                             |
| **Large Scalability Review**   | performance-optimization + clean-architecture  |
| **API Development**            | senior-developer-standard                      |
| **Database Optimization**      | performance-optimization                       |
| **Security Implementation**    | senior-developer-standard + clean-architecture |
| **Testing Strategy**           | senior-developer-standard                      |
| **Performance Tuning**         | performance-optimization                       |
| **Team Standards Enforcement** | All skills                                     |

---

## 🌟 Professional Usage Examples

### Example 1: Professional Authentication Service

```typescript
/**
 * Professional User Authentication Service
 * Applies: senior-developer-standard, security, error handling
 */
class AuthenticationService {
  async register(userData: CreateUserDTO): Promise<UserResponse> {
    // 1. Validate input
    this.validateUser(userData);

    // 2. Check existing users
    await this.checkEmailExists(userData.email);

    // 3. Hash password securely
    const hashedPassword = await this.hashPassword(userData.password);

    // 4. Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // 5. Generate tokens
    const tokens = this.generateAuthTokens(user.id);

    // 6. Send verification email
    await this.sendVerificationEmail(user);

    // 7. Log for audit
    await this.auditLog(EVENTS.USER_CREATED, user.id);

    return {
      user: this.toUserProfile(user),
      tokens,
      requiresVerification: true,
    };
  }

  private validateUser(CreateUserDTO): void {
    if (!isEmail(data.email)) {
      throw new ValidationError("Invalid email format");
    }
    if (data.password.length < 8) {
      throw new ValidationError("Password too short");
    }
    // Additional validations...
  }
}
```

### Example 2: Clean Architecture Design

```typescript
/**
 * Clean Architecture Implementation
 * Applies: clean-architecture, DDD patterns
 */
@UseCase
class UserManagementUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private validator: UserValidatorInterface,
    private eventPublisher: IEventPublisher,
  ) {}

  async createProfile(command: CreateProfileCommand): Promise<Profile> {
    // Domain validation
    this.validator.validateDomain(command);

    // Repository operations (no business logic in repository)
    const user = await this.userRepository.findById(command.userId);

    // Business rules (inside use case)
    if (user.hasMaxProfiles()) {
      throw new BusinessRuleViolation("Maximum profiles exceeded");
    }

    // Create new profile
    const profile = await this.profileRepository.create({
      userId: user.id,
      name: command.name,
      description: command.description,
    });

    // Publish event (decoupled from business logic)
    await this.eventPublisher.publish(new ProfileCreatedEvent(profile));

    return profile;
  }
}
```

### Example 3: Performance Optimization

```typescript
/**
 * Performance-Optimized Data Fetching
 * Applies: performance-optimization, caching, async patterns
 */
class OptimizedDataFetcher {
  private cache = new Map<
    string,
    {
      any;
      timestamp: number;
      ttl: number;
    }
  >();
  private databasePool: Pool;

  async fetchUsers(userId: string): Promise<User[]> {
    // 1. Check cache first
    const cacheKey = `users:${userId}`;
    const cached = this.checkCache(cacheKey);

    if (cached) {
      logPerformance("cache_hit", "users", cached.size);
      return cached;
    }

    // 2. Batch query (process in parallel)
    const users = await this.databasePool.query(
      `
      SELECT u.*, p.* 
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      WHERE u.user_id = $1
    `,
      [userId],
    );

    // 3. Cache the result (10 minutes TTL)
    this.setCache(cacheKey, users, 600000);

    return users;
  }

  private checkCache(key: string): User[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }
}
```

---

## 🔒 Security & Best Practices

### Included Security Measures

- ✅ **Password Hashing**: bcrypt with configurable salt rounds
- ✅ **JWT Authentication**: Secure token generation and validation
- ✅ **Input Validation**: Comprehensive sanitization and validation
- ✅ **SQL Injection Protection**: Parameterized queries
- ✅ **CSRF Protection**: Token-based validation
- ✅ **Rate Limiting**: Request throttling mechanisms
- ✅ **Audit Logging**: Comprehensive event tracking
- ✅ **Environment Variables**: Secure configuration management

---

## 📂 Directory Structure

```
senior-architect-skills/
├── skills/
│   ├── senior-developer-standard/
│   │   └── SKILL.md
│   ├── clean-architecture/
│   │   └── SKILL.md
│   └── performance-optimization/
│       └── SKILL.md
├── .cursor/
│   ├── rules/
│   │   └── cursor-skills.xml
│   ├── claude-config.json
│   └── cline-config.json
├── .github/
│   ├── workflows/
│   │   └── validate.yml
│   └── copilot-instructions.md
├── scripts/
│   ├── sync-skills.js
│   ├── generate-docs.js
│   └── validate-skills.js
├── CONTRIBUTING.md
├── SECURITY.md
├── CLAUDE.md
├── .gitignore
├── package.json
├── LICENSE
├── README.md
└── ARCHITECTURE.md
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

### Adding a New Skill

```bash
# Create new skill directory
mkdir -p skills/new-skill

# Create SKILL.md with frontmatter
cat > skills/new-skill/SKILL.md << 'EOF'
---
name: new-skill
description: One-line description of what this skill does
---

# Skill Title

Use this skill when:
- ...description of usage scenarios
EOF

# Validate
node scripts/validate-skills.js
```

---

## 📈 Project Statistics

| Metric              | Value                         |
| ------------------- | ----------------------------- |
| Total Skills        | 3 Major Skills                |
| Code Examples       | 150+ Real-world patterns      |
| Lines of Code       | ~5,000+ professional standard |
| Documentation Files | 8+ Comprehensive guides       |
| Tool Configurations | 5 Major Tools                 |
| Production Coverage | 100% Enterprise-ready         |
| Security Standards  | OWASP Top 10 Protection       |
| Performance Targets | O(n) or better algorithms     |
| Test Coverage       | 70%+ Recommended              |

---

## 🎓 Learning Resources

- **[Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)**
- **[Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)**
- **[Refactoring by Martin Fowler](https://refactoring.com/)**
- **[Effective TypeScript by Dan Tunkelang](https://effectivetypescript.com/)**
- **[Performance Optimization Guidelines](https://developers.google.com/web/fundamentals/performance)**
- **[OWASP Security Guidelines](https://owasp.org/)**

---

## 📞 Contact

- **GitHub**: [@ozeydi](https://github.com/ozeydi)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 ozeydi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⭐ Star History

If you find these skills useful, please consider:

- ⭐ **Star the repository** for visibility
- 🔔 **Watch for updates** on new patterns
- 🌟 **Share with colleagues** for team benefits
- 💬 **Open issues** for feedback and suggestions
- 🤝 **Contribute** your professional patterns

---

## 🎯 Who Is This For

This project helps:

- **Developers** write production-ready code with proven patterns
- **Teams** enforce consistent code quality standards
- **Architects** design clean, maintainable systems
- **Tech Leads** onboard developers with documented best practices
- **AI Coding Tools** generate higher-quality code with structured guidance

---

<div align="center">

**Made with 💜 by ozeydi**

_Enterprise-grade software development skills for the AI-powered era_

[📖 Documentation](./ARCHITECTURE.md) • [🛠️ Installation](#-quick-start) • [🤝 Contributing](./CONTRIBUTING.md) • [🔒 License](./LICENSE)

</div>
