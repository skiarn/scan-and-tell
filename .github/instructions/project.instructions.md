# scan-and-tell
---

## 🧠 Copilot Instructions

These instructions guide Copilot's behavior across this project.

### 🗂️ Project Structure

- Use a **feature-based folder structure**:  
  Each feature should live in its own folder containing all relevant files (e.g., components, styles, tests, documentation).

  ```
  /src
    /features
      /login
        Login.tsx
        login.css
        Login.test.ts
        README.md
      /dashboard
        Dashboard.tsx
        dashboard.css
        Dashboard.test.ts
        README.md
  ```

- Shared utilities or components should go in `/src/shared`.

---

### 🧪 Unit Testing

- Automatically generate **unit tests** for all new components and functions.
- Use **Jest** and **React Testing Library** (if applicable).
- Place test files alongside the component with `.test.ts` or `.test.tsx` suffix.
- Include edge cases and mock dependencies where needed.

---

### 📚 Documentation Guidelines

- Every feature folder should include a `README.md` explaining:
  - Purpose of the feature
  - Key components and logic
  - How to test and extend it

- To document how to write documentation:
  - Create a guide at `/docs/documentation-guide.md`
  - Include examples, formatting rules, and templates

---

### 🛣️ Roadmap Tracking

- All features must be tracked in `roadmap.md` at the root of the project.
- When a feature is added, updated, or completed:
  - Update its status in `roadmap.md`
  - Include a brief summary of the change
  - Use checkboxes for progress tracking

  ```markdown
  ## Roadmap

  - [x] Basic text input → story display  
  - [ ] AI-generated story support
  - [ ] Story editing interface (text + image) 
  ```

---

### 🤖 Copilot Behavior

- Prioritize writing unit tests and documentation when generating code.
- Follow the feature-based structure strictly.
- Suggest updates to `roadmap.md` when relevant.
- Use TypeScript best practices and clean CSS.

---
