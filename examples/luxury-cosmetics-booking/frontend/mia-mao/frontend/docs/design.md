## 🏞 Design

### Styled Components 💅

Follow the code principles when using styled-components

- Do not use className and classes

### 💠 CSS

#### 🌈 Stylesheet

[`stylesheet.ts`](../src/stylesheet.ts) is where you should declare all style properties used on this app.

- colors
- font properties (size, font-faimly, boldness, line height)
- spacing measurement unit (ex: all margin, padding must be multiple of 8px)
- screen size breakpoints
- shades
- ...

This way, you can manage the app look and feel from one file instead of several, and preserve consistency.

Import the style variables from the stylesheet to use them in your components.

#### 🔍 Linter

The [`style linter`](../stylelint.config.js) will help checking that you don't use hard-coded values in your components. Adapt the config to your needs.
