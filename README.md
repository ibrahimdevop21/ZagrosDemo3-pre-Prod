# 🌱 Zagros Agriculture Website

Welcome to the **Zagros Agriculture** website repository! This project is built using **Astro.js, React, and TailwindCSS** to provide a modern and performant web experience for an agriculture company in Sudan. 🌾🚜

## 🚀 Features
- **Dynamic Hero Section** with a **Swiper.js** carousel showcasing the company's key sectors
- **Multi-language Support** (English & Arabic) with Astro's built-in i18n
- **Fast & SEO-friendly** using Astro.js
- **Beautiful UI** with TailwindCSS
- **Reusable React Components** for modular development

## 🛠️ Tech Stack
- **Astro.js** – Blazing-fast frontend framework
- **React.js** – Component-based UI
- **TailwindCSS** – Utility-first CSS for styling
- **Swiper.js** – Carousel for showcasing content

## 🌍 Internationalization (i18n)
This project supports **multi-language functionality** with **English (default) and Arabic**.

### 📌 How It Works:
- The **default language** is **English**.
- **Localized routes** are generated for Arabic content.
- Uses **Astro's i18n configuration** to manage translations.

### 🏗️ Adding a New Language:
1. Update `astro.config.mjs`:
   ```js
   export default defineConfig({
     i18n: {
       defaultLocale: 'en',
       locales: ['en', 'ar', 'NEW_LANGUAGE'],
       routing: {
         prefixDefaultLocale: false,
       },
     },
   });
   ```
2. Add translation files in the appropriate `locales/` directory.
3. Update content components to support multi-language rendering.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/zagros2.git
cd zagros2
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```

The website will be available at **`http://localhost:4321`** (or the port Astro assigns).

## 📌 Branching & Contribution Guidelines

### 🌿 Creating a Feature Branch
1. Pull the latest changes from `main`:
   ```sh
   git checkout main
   git pull origin main
   ```
2. Create a new branch following this naming convention:
   ```sh
   git checkout -b feature/your-feature-name
   ```

### ✅ Committing & Pushing Changes
1. Stage changes:
   ```sh
   git add .
   ```
2. Commit with a meaningful message:
   ```sh
   git commit -m "feat: add responsive Swiper.js carousel to hero section"
   ```
3. Push the feature branch:
   ```sh
   git push origin feature/your-feature-name
   ```

### 🔄 Open a Pull Request (PR)
- Once your feature is complete, open a **PR to `main`**.
- Include a clear description of your changes.
- Request a review before merging.

## 📜 License
This project is open-source and available for modification. Feel free to contribute! 🚀

## 🤝 Contributing
If you'd like to contribute, fork the repo, create a feature branch, and submit a PR!

## 🌍 Connect
Have suggestions or feedback? Reach out via GitHub Issues or start a discussion!

---
🎉 Happy Coding! 🚀

