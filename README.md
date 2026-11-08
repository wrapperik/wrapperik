<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/hero-dark.svg" />
  <img src="assets/generated/hero-light.svg" width="100%" alt="Hello, I'm Rikus Pretorius. I build full-stack products end to end. Interactive Development and UX Design, Open Window, class of 2026." />
</picture>

<p align="center">
  <a href="#about-me">About</a> &nbsp;·&nbsp;
  <a href="#tech-stack">Tech stack</a> &nbsp;·&nbsp;
  <a href="#portfolio-projects">Projects</a> &nbsp;·&nbsp;
  <a href="#activity">Activity</a> &nbsp;·&nbsp;
  <a href="#contact">Contact</a>
</p>

## About me

I design and build software end to end, from the first wireframe to the deployed product. With a double major in Interactive Development and UX Design, I care as much about *why* an interface works as about the code behind it.

This year I shipped three products: a cross-platform learning management system with a team of four, a gesture-only revision app for iOS and Android, and an AI workspace that assembles its interface around the task in front of you.

**Career focus**

- **Full-stack product development:** typed React frontends with .NET, Firebase and Supabase backends
- **Design systems and UX:** research, wireframes and component libraries, with accessibility built in (contrast checks, reduced motion, alternative inputs)
- **AI-native interfaces:** structured model output, schema validation and safe fallbacks, so the AI never has the last word on data
- **Cross-platform apps:** Electron on the desktop, React Native and Expo on mobile
- **Engineering quality:** automated testing, clear Git history and CI

## Tech stack

<table>
  <tr>
    <td><b>Languages</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/languages-dark.svg" /><img src="assets/stack/languages-light.svg" height="44" alt="TypeScript, JavaScript, C#, HTML, CSS" /></picture></td>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/frontend-dark.svg" /><img src="assets/stack/frontend-light.svg" height="44" alt="React, Vite, Tailwind CSS, Material UI, Zod, Framer Motion" /></picture></td>
  </tr>
  <tr>
    <td><b>Desktop &amp; mobile</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/apps-dark.svg" /><img src="assets/stack/apps-light.svg" height="44" alt="Electron, Expo, React Native" /></picture></td>
  </tr>
  <tr>
    <td><b>Backend &amp; data</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/backend-dark.svg" /><img src="assets/stack/backend-light.svg" height="44" alt=".NET, Node.js, PostgreSQL, Supabase, Firebase" /></picture></td>
  </tr>
  <tr>
    <td><b>AI</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/ai-dark.svg" /><img src="assets/stack/ai-light.svg" height="44" alt="Google Gemini, DeepSeek, Claude" /></picture></td>
  </tr>
  <tr>
    <td><b>DevOps &amp; testing</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/devops-dark.svg" /><img src="assets/stack/devops-light.svg" height="44" alt="Docker, Vercel, GitHub Actions, Jest, Vitest, Git, GitHub" /></picture></td>
  </tr>
  <tr>
    <td><b>Design</b></td>
    <td><picture><source media="(prefers-color-scheme: dark)" srcset="assets/stack/design-dark.svg" /><img src="assets/stack/design-light.svg" height="44" alt="Figma" /></picture></td>
  </tr>
</table>

## Portfolio projects

My three DV300 major projects from 2026. Each repository has full documentation: setup, architecture, testing and a demo.

<table>
<tr>
<td>

<h3><img src="assets/generated/koru-title.svg" width="100%" alt="Koru" /></h3>

<a href="https://github.com/wrapperik/koru"><img src="assets/projects/koru.webp" width="100%" alt="Koru running in a desktop window, with its dashboard, course list, assignments and progress cards" /></a>

**A cross-platform learning management system for students, lecturers and administrators.**

Koru replaces a college's patchwork of tools with one POPIA-compliant platform for courses, assignments, grading, attendance, timetables and analytics, each tailored to the role that signs in.

**My focus:** the frontend and its design system. I built the Material 3–based component library, the split-screen sign-in flow, the dashboards and analytics views, grades and attendance, avatars throughout, and the AI assistant, and I fixed the timetabling flow.

![React](https://img.shields.io/badge/React-161b22?style=flat-square&logo=react&logoColor=61DAFB) ![Electron](https://img.shields.io/badge/Electron-161b22?style=flat-square&logo=electron&logoColor=9FEAF9) ![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-161b22?style=flat-square&logo=dotnet&logoColor=A57BE8) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-161b22?style=flat-square&logo=postgresql&logoColor=6CA6E0) ![Docker](https://img.shields.io/badge/Docker-161b22?style=flat-square&logo=docker&logoColor=2496ED) ![Jest](https://img.shields.io/badge/Jest-161b22?style=flat-square&logo=jest&logoColor=C21325) ![xUnit](https://img.shields.io/badge/xUnit-161b22?style=flat-square&logo=dotnet&logoColor=A57BE8)

**[Repository →](https://github.com/wrapperik/koru)**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/koru-dark.svg" />
  <img src="assets/generated/koru-light.svg" width="100%" alt="Koru activity: commits, my commits, branches, tests and commits per week in 2026" />
</picture>

<details>
<summary><b>More screens</b></summary>
<br />
<img src="assets/projects/koru-teacher.webp" width="49%" alt="Koru lecturer view" />
<img src="assets/projects/koru-admin.webp" width="49%" alt="Koru administrator view" />
</details>

</td>
</tr>
</table>

<table>
<tr>
<td>

<h3><img src="assets/generated/cardinal-title.svg" width="100%" alt="Cardinal" /></h3>

<a href="https://github.com/wrapperik/cardinal"><img src="assets/projects/cardinal.webp" width="100%" alt="Two phones running Cardinal: a question with answers at the compass points, and a course-complete screen" /></a>

**A revision app where the direction you swipe is the answer.**

Each question's answers sit at the four compass points around it, and you flick towards the one you believe is right. The original design has no buttons at all; version 2.0 adds a tap-based Traditional mode so the app works for everyone. Students upload their own notes, and Gemini turns them into decks through a Cloud Function, so the API key never reaches the device.

- Gesture physics on the UI thread with Reanimated and Gesture Handler
- Local-first data: cached reads and an offline outbox that syncs to Firestore
- Four game templates, streaks, scoring and an admin dashboard

![Expo](https://img.shields.io/badge/Expo-161b22?style=flat-square&logo=expo&logoColor=FFFFFF) ![React Native](https://img.shields.io/badge/React_Native-161b22?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-161b22?style=flat-square&logo=typescript&logoColor=3178C6) ![Firebase](https://img.shields.io/badge/Firebase-161b22?style=flat-square&logo=firebase&logoColor=FFCA28) ![Gemini](https://img.shields.io/badge/Gemini_API-161b22?style=flat-square&logo=googlegemini&logoColor=8E75B2) ![Vitest](https://img.shields.io/badge/Vitest-161b22?style=flat-square&logo=vitest&logoColor=6E9F18)

**[Repository →](https://github.com/wrapperik/cardinal)** &nbsp;·&nbsp; **[Demo video →](https://youtu.be/275TFCt4XFM)**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/cardinal-dark.svg" />
  <img src="assets/generated/cardinal-light.svg" width="100%" alt="Cardinal activity: commits, branches, tests and commits per week in 2026" />
</picture>

<details>
<summary><b>More screens</b></summary>
<br />
<img src="assets/projects/cardinal-home.webp" width="49%" alt="Cardinal home screen with daily stats" />
<img src="assets/projects/cardinal-games.webp" width="49%" alt="Cardinal game templates and checkpoint screen" />
</details>

</td>
</tr>
</table>

<table>
<tr>
<td>

<h3><img src="assets/generated/droplet-title.svg" width="100%" alt="Droplet" /></h3>

<a href="https://droplet-tan.vercel.app"><img src="assets/projects/droplet.webp" width="100%" alt="Droplet's start screen with the message bar, the workspaces menu, the board and the brand palette" /></a>

**An AI workspace for small business owners that builds the interface around the task.**

Founders say what they need, such as an invoice, a brand palette or a business plan, and Droplet opens the right workspace from a library of tested components. The model decides what to show; the app's own code draws it, checks it and does the sums, so totals and VAT are never left to the AI.

- Every AI turn is validated against a Zod schema, retried once with the reasons, then falls back safely
- Every change is listed with Undo, and nothing is saved without the founder's say-so
- Web research, attachments, chat memory and branded PDF exports

![React](https://img.shields.io/badge/React-161b22?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-161b22?style=flat-square&logo=typescript&logoColor=3178C6) ![Supabase](https://img.shields.io/badge/Supabase-161b22?style=flat-square&logo=supabase&logoColor=3FCF8E) ![Zod](https://img.shields.io/badge/Zod-161b22?style=flat-square&logo=zod&logoColor=3E67B1) ![Vercel](https://img.shields.io/badge/Vercel-161b22?style=flat-square&logo=vercel&logoColor=FFFFFF) ![DeepSeek](https://img.shields.io/badge/DeepSeek-161b22?style=flat-square&logo=deepseek&logoColor=4D6BFE) ![Gemini](https://img.shields.io/badge/Gemini_fallback-161b22?style=flat-square&logo=googlegemini&logoColor=8E75B2)

**[Live app →](https://droplet-tan.vercel.app)** &nbsp;·&nbsp; **[Repository →](https://github.com/wrapperik/droplet)** &nbsp;·&nbsp; **[Walkthrough →](https://youtu.be/oBLeca-GEqo)** &nbsp;·&nbsp; **[Promo →](https://youtu.be/WLlGiDC9sms)**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/droplet-dark.svg" />
  <img src="assets/generated/droplet-light.svg" width="100%" alt="Droplet activity: commits, branches, tests and commits per week in 2026" />
</picture>

<details>
<summary><b>More screens</b></summary>
<br />
<img src="assets/projects/droplet-brand.webp" width="49%" alt="Droplet brand workspace with colour roles and contrast checks" />
<img src="assets/projects/droplet-invoice.webp" width="49%" alt="Droplet invoice workspace in Guide mode" />
</details>

</td>
</tr>
</table>

## Activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/stats-dark.svg" />
  <img src="assets/generated/stats-light.svg" width="100%" alt="My 2026 GitHub activity: contributions, commits, active days, public repositories, a contribution calendar and languages" />
</picture>

<details>
<summary><b>Earlier work (DV200, 2025)</b></summary>
<br />

| Project | What it is | Repository |
|---|---|---|
| **Gamestat** | Compare games side by side | [formative-one-gamestat](https://github.com/wrapperik/formative-one-gamestat) |
| **Billionaires** | An e-commerce store for the very rich (team project) | [Code_Blooded_DV200_S1SA2_Ecommerce_App](https://github.com/victordupreez0/Code_Blooded_DV200_S1SA2_Ecommerce_App) |
| **Unmute** | An online community for men's mental health | [unMute_RikusPretorius_241044](https://github.com/wrapperik/unMute_RikusPretorius_241044) |

</details>

## Contact

<p align="center">
  <a href="mailto:rikuspretorius.web@gmail.com"><img src="https://img.shields.io/badge/rikuspretorius.web@gmail.com-161b22?style=for-the-badge&logo=gmail&logoColor=EA4335" alt="Email rikuspretorius.web@gmail.com" /></a>
  <a href="https://github.com/wrapperik"><img src="https://img.shields.io/badge/wrapperik-161b22?style=for-the-badge&logo=github&logoColor=FFFFFF" alt="GitHub wrapperik" /></a>
</p>

<sub>The hero, project and stats cards on this page are SVGs generated by <a href="scripts/generate.mjs">a small Node script</a> and refreshed daily by <a href=".github/workflows/refresh-cards.yml">a GitHub Action</a>. They follow your light or dark theme and respect reduced-motion settings. Stack icons from <a href="https://skillicons.dev">Skill Icons</a> and <a href="https://simpleicons.org">Simple Icons</a>; type set in <a href="https://github.com/JulietaUla/Montserrat">Montserrat</a> (SIL Open Font License).</sub>
