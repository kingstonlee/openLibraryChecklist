# Git Branching Strategy for California Library Tracker 📚

This document outlines the branching strategy for the library tracking app, designed for both development and deployment workflows.

## Branch Structure

```
main (production)
├── develop (development)
├── feature/library-search
├── feature/image-upload
├── feature/visit-tracking
├── hotfix/security-patch
└── release/v1.1.0
```

## Branch Types

### 1. **main** (Production)
- **Purpose**: Live production code
- **Source**: `develop` branch or hotfixes
- **Deployment**: Automatically deployed to Dreamhost Apps
- **Protection**: No direct commits, only merges

### 2. **develop** (Development)
- **Purpose**: Integration branch for features
- **Source**: Feature branches
- **Deployment**: Staging environment (optional)
- **Protection**: No direct commits, only merges

### 3. **feature/** (Feature Branches)
- **Purpose**: New features and enhancements
- **Source**: `develop` branch
- **Naming**: `feature/descriptive-name`
- **Examples**:
  - `feature/library-search`
  - `feature/image-upload`
  - `feature/visit-tracking`
  - `feature/mobile-responsive`
  - `feature/user-authentication`

### 4. **hotfix/** (Hotfix Branches)
- **Purpose**: Critical bug fixes for production
- **Source**: `main` branch
- **Naming**: `hotfix/issue-description`
- **Examples**:
  - `hotfix/security-vulnerability`
  - `hotfix/database-connection`
  - `hotfix/image-upload-error`

### 5. **release/** (Release Branches)
- **Purpose**: Prepare for new releases
- **Source**: `develop` branch
- **Naming**: `release/v1.1.0`
- **Examples**:
  - `release/v1.0.0`
  - `release/v1.1.0`
  - `release/v2.0.0`

## Workflow

### Feature Development

1. **Create feature branch from develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. **Develop and commit:**
   ```bash
   git add .
   git commit -m "feat: add new library search functionality"
   ```

3. **Push feature branch:**
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request** (if using GitHub/GitLab):
   - Source: `feature/new-feature`
   - Target: `develop`
   - Review and merge

5. **Merge to develop:**
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   ```

### Release Process

1. **Create release branch:**
   ```bash
   git checkout develop
   git checkout -b release/v1.1.0
   ```

2. **Update version and documentation:**
   ```bash
   # Update package.json version
   # Update CHANGELOG.md
   git add .
   git commit -m "chore: prepare release v1.1.0"
   ```

3. **Merge to main and develop:**
   ```bash
   git checkout main
   git merge release/v1.1.0
   git tag v1.1.0
   git push origin main --tags
   
   git checkout develop
   git merge release/v1.1.0
   git push origin develop
   ```

4. **Delete release branch:**
   ```bash
   git branch -d release/v1.1.0
   git push origin --delete release/v1.1.0
   ```

### Hotfix Process

1. **Create hotfix branch:**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-bug
   ```

2. **Fix the issue:**
   ```bash
   # Make necessary changes
   git add .
   git commit -m "fix: resolve critical security vulnerability"
   ```

3. **Merge to main and develop:**
   ```bash
   git checkout main
   git merge hotfix/critical-bug
   git tag v1.0.1
   git push origin main --tags
   
   git checkout develop
   git merge hotfix/critical-bug
   git push origin develop
   ```

4. **Delete hotfix branch:**
   ```bash
   git branch -d hotfix/critical-bug
   git push origin --delete hotfix/critical-bug
   ```

## Dreamhost Apps Deployment

### Production Deployment (main branch)
- **Automatic**: Dreamhost Apps deploys from `main` branch
- **Manual**: Deploy from Dreamhost panel
- **Environment**: Production

### Staging Deployment (develop branch)
- **Optional**: Set up staging subdomain
- **Manual**: Deploy from Dreamhost panel
- **Environment**: Staging

## Branch Protection Rules

### For GitHub/GitLab (if using):

1. **main branch:**
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes
   - Include administrators

2. **develop branch:**
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes

## Commit Message Convention

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples:
```bash
git commit -m "feat(library): add search by county functionality"
git commit -m "fix(upload): resolve image upload error on mobile"
git commit -m "docs(readme): update deployment instructions"
git commit -m "style(css): improve mobile responsiveness"
```

## Current Branches Setup

Let's set up the initial branch structure:

```bash
# Current: main branch (production-ready)
git checkout -b develop
git push origin develop

# Create feature branches as needed
git checkout develop
git checkout -b feature/enhancement
# ... work on features
```

## Branch Management Commands

### Useful Commands:

```bash
# List all branches
git branch -a

# Switch to branch
git checkout branch-name

# Create and switch to new branch
git checkout -b feature/new-feature

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Update local branches
git fetch --all
git branch -r

# Merge develop into main
git checkout main
git merge develop
git push origin main
```

## Deployment Workflow

### For Dreamhost Apps:

1. **Development:**
   - Work on `feature/` branches
   - Merge to `develop`
   - Test on staging (optional)

2. **Release:**
   - Create `release/` branch from `develop`
   - Final testing and version updates
   - Merge to `main` and `develop`

3. **Production:**
   - `main` branch auto-deploys to Dreamhost Apps
   - Monitor for issues

4. **Hotfix:**
   - Create `hotfix/` branch from `main`
   - Fix critical issues
   - Merge to `main` and `develop`

## Best Practices

1. **Never commit directly to main or develop**
2. **Always create feature branches for new work**
3. **Use descriptive branch names**
4. **Write clear commit messages**
5. **Test before merging to develop**
6. **Tag releases properly**
7. **Keep branches up to date**
8. **Delete merged branches**

---

This branching strategy ensures a clean, organized development process while maintaining a stable production environment for your library tracking app! 📚✨ 