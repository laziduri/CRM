# 📦 Install Node.js (Required)

Your system doesn't have Node.js/npm installed. You need to install it first.

## 🚀 Quick Installation Options:

### Option 1: Install via Homebrew (Recommended)

1. **Install Homebrew** (if you don't have it):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node
   ```

3. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

### Option 2: Install via Official Installer (Easier)

1. **Download Node.js**:
   - Go to: https://nodejs.org/
   - Download the LTS (Long Term Support) version for macOS
   - Run the installer (.pkg file)
   - Follow the installation wizard

2. **Verify installation**:
   - Open a NEW terminal window (important!)
   - Run:
     ```bash
     node --version
     npm --version
     ```

### Option 3: Install via nvm (Node Version Manager)

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Restart terminal** or run:
   ```bash
   source ~/.zshrc
   ```

3. **Install Node.js**:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

4. **Verify**:
   ```bash
   node --version
   npm --version
   ```

## ✅ After Installation:

1. **Close and reopen your terminal** (important!)
2. Navigate to your project:
   ```bash
   cd /Users/lazawalrus/CRM
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## 🎯 Recommended: Option 2 (Official Installer)

The easiest way is to download from nodejs.org - it's a simple installer that handles everything for you!
