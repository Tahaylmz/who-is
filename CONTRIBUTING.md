# 🤝 Contributing to Who-Is

Thank you for your interest in contributing to Who-Is! This document provides guidelines and information for contributors.

## 🎯 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Code Style](#-code-style)
- [Architecture Guidelines](#-architecture-guidelines)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Community Guidelines](#-community-guidelines)

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ 
- **npm** v8+
- **Git** for version control
- Code editor (VS Code recommended)

### 📦 Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/who-is.git
cd who-is

# 2. Install dependencies
npm install

# 3. Create a new branch
git checkout -b feature/your-feature-name

# 4. Test the setup
npm start help
npm run server
```

### 🔧 Environment Configuration

```bash
# Create .env file (optional)
OPENAI_API_KEY=your_openai_key_here
PORT=3001
LOG_LEVEL=debug
```

## 🏗️ Architecture Guidelines

This project follows **Clean Architecture** principles with **Dependency Injection**:

### 📁 Project Structure
```
src/
├── 🏛️ domain/          # Business logic (no dependencies)
├── 💼 application/     # Use cases (depends on domain)
├── 🔧 infrastructure/ # External dependencies
├── 🖥️ presentation/   # UI layers (CLI, Web)
└── 🔗 shared/         # Common utilities
```

### 🎯 Layer Dependencies
- **Domain**: No dependencies on other layers
- **Application**: Depends only on Domain
- **Infrastructure**: Implements Domain interfaces
- **Presentation**: Uses Application use cases

### 💉 Dependency Injection
```javascript
// ✅ Good: Use DI Container
const container = getContainer();
const useCase = container.resolve('checkSiteUseCase');

// ❌ Bad: Manual instantiation
const useCase = new CheckSiteUseCase(new HttpChecker(), ...);
```

## 🎨 Code Style

### 📝 JavaScript Guidelines

```javascript
// ✅ Good practices
class ExampleService {
    constructor(dependency) {
        this.dependency = dependency;
        this.logger = new Logger('ExampleService');
    }

    async processData(input) {
        try {
            // Validate input
            if (!input) {
                throw new Error('Input required');
            }

            // Process
            const result = await this.dependency.process(input);
            this.logger.info('Data processed successfully');
            
            return result;
        } catch (error) {
            this.logger.error('Processing failed', error);
            throw error;
        }
    }
}
```

### 🎯 Naming Conventions
- **Files**: PascalCase for classes (`CheckSiteUseCase.js`)
- **Variables**: camelCase (`domainGenerator`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Functions**: camelCase with descriptive names

### 📖 Documentation
- Use JSDoc for function documentation
- Include emojis for visual clarity
- Explain complex business logic
- Update README when needed

## 🧪 Testing

### 🔬 Testing Strategy
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test specific component
npm test -- CheckSiteUseCase
```

### 📋 Test Guidelines
- Write unit tests for use cases
- Mock external dependencies
- Test error scenarios
- Maintain high test coverage

### 🏷️ Test Examples
```javascript
describe('CheckSiteUseCase', () => {
    let useCase;
    let mockSiteChecker;
    let mockRepository;

    beforeEach(() => {
        mockSiteChecker = {
            checkSite: jest.fn()
        };
        useCase = new CheckSiteUseCase(mockSiteChecker, mockRepository);
    });

    it('should check site successfully', async () => {
        // Test implementation
    });
});
```

## 📋 Pull Request Process

### 🔄 Before Submitting
1. **Test**: Ensure all tests pass
2. **Lint**: Fix any linting issues
3. **Documentation**: Update relevant docs
4. **Dependencies**: Check for security issues

### 📝 PR Description Template
```markdown
## 🎯 Description
Brief description of changes

## 🔧 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## ✅ Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## 📚 Documentation
- [ ] README updated
- [ ] Code comments added
- [ ] API docs updated
```

### 🎯 PR Guidelines
- Keep PRs focused and small
- Write clear commit messages
- Include tests for new features
- Update documentation
- Respond to review feedback promptly

## 🐛 Issue Guidelines

### 🔍 Bug Reports
```markdown
**Bug Description**: Clear description
**Steps to Reproduce**: 1, 2, 3...
**Expected Behavior**: What should happen
**Actual Behavior**: What actually happens
**Environment**: OS, Node.js version, etc.
**Additional Context**: Screenshots, logs, etc.
```

### 💡 Feature Requests
```markdown
**Feature Description**: What you want to add
**Use Case**: Why is this needed
**Proposed Solution**: How should it work
**Alternatives**: Other approaches considered
```

### 🏷️ Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## 🌟 Community Guidelines

### 🤝 Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's vision

### 💬 Communication
- **GitHub Issues**: Bug reports and features
- **Pull Requests**: Code discussions
- **Discussions**: General questions and ideas

### 🎯 Best Practices
- Read existing issues before creating new ones
- Use clear and descriptive titles
- Provide complete information
- Be patient with responses

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## 📞 Getting Help

- **Documentation**: Check README.md first
- **Issues**: Search existing issues
- **Discussions**: For general questions
- **Code**: Look at existing implementations

## 🚀 Development Commands

```bash
# Development
npm start help              # CLI help
npm run server             # Start web server
npm run server:dev         # Development mode

# Testing
npm test                   # Run tests
npm run lint              # Code linting
npm audit                 # Security audit

# Utilities
npm run clean             # Clean install
npm outdated              # Check updates
```

---

> 🎯 **Quality over quantity**. We prefer small, well-tested contributions over large, untested ones.

Thank you for contributing to Who-Is! 🚀

Last updated: July 29, 2025
