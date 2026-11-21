# ZIO CV Builder

A free, responsive online CV and resume builder built with **HTML, CSS, and Vanilla JavaScript**. Create a professional CV, customize its design, preview changes instantly, and download it as a PDF.

<p align="center">
  <a href="https://adibrasel.github.io/ZIO-CV-Builder/">
    <strong>🌐 Live Demo</strong>
  </a>
  &nbsp;·&nbsp;
  <a href="https://github.com/AdibRasel/ZIO-CV-Builder">
    <strong>📂 GitHub Repository</strong>
  </a>
</p>

## ✨ Features

- Create and edit professional CVs.
- Live CV preview.
- Five professional CV templates:
  - Classic
  - Modern
  - Minimal
  - Creative
  - Professional
- Multiple accent color options.
- Personal Mode with preloaded profile data.
- Guest Mode for creating a custom CV.
- Add and edit personal information, experience, education, skills, projects, languages, and certifications.
- Download CV as PDF using the browser's print functionality.
- Import and export CV data in JSON format.
- Automatically save guest data in browser LocalStorage.
- Responsive design for desktop, tablet, and mobile.
- Optional background animation.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Font Awesome
- Google Fonts

## 📁 Project Structure

```text
ZIO-CV-Builder/
├── index.html
├── README.md
├── robots.txt
├── sitemap.xml
├── 404.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── editor.js
│   ├── preview.js
│   ├── export.js
│   └── script.js
└── assets/
    ├── images/
    │   ├── favicon.png
    │   └── og-image.png
    └── data/
        └── profile.json
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AdibRasel/ZIO-CV-Builder.git
```

### 2. Open the Project

```bash
cd ZIO-CV-Builder
```

### 3. Run Locally

Open the project using a local development server, such as the VS Code Live Server extension.

A local HTTP server is required because browsers block fetching the profile JSON file directly through the `file://` protocol.

## 🌐 Live Demo

Try ZIO CV Builder online:

**[https://adibrasel.github.io/ZIO-CV-Builder/](https://adibrasel.github.io/ZIO-CV-Builder/)**

## 📦 Deployment

This project is hosted using GitHub Pages.

To deploy your own copy:

1. Fork or clone this repository.
2. Push the project files to your GitHub repository.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` directory.
6. Save your settings.

## 🔒 Privacy

- Guest Mode stores CV data in the browser's LocalStorage.
- Personal Mode loads the default profile data from `assets/data/profile.json`.
- No backend server or database is required.
- Personal profile JSON files in a public repository can be viewed by anyone. Avoid storing confidential information in them.

## 👨‍💻 Developer

**Rasal Hossain**  
Software Developer

- **Website:** [https://adibrasel.github.io/ZIO-CV-Builder/](https://adibrasel.github.io/ZIO-CV-Builder/)
- **GitHub:** [AdibRasel](https://github.com/AdibRasel)
- **LinkedIn:** [Rasal Hossain](https://www.linkedin.com/in/raselhossainadib)
- **Email:** [rasal.hossain.dev@gmail.com](mailto:rasal.hossain.dev@gmail.com)

---

<p align="center">
  Made with ❤️ by <strong>Rasal Hossain</strong>
</p>
