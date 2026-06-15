# VORTKART Visual CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the raw JSON admin with beginner-friendly forms and a Puck visual page builder while retaining Next.js, Supabase, and `/admin`.

**Architecture:** Structured records such as products, projects, settings, inquiries, navigation, and theme use dedicated form modules. Flexible page composition uses Puck and a `pages.content` JSONB column that is never exposed as raw JSON. Supabase remains the source of truth and Storage handles media.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind, Puck, Supabase.

---

### Task 1: Database and content contracts
- [x] Add migration-safe SQL for expanded settings, product SEO, pages, navigation, and homepage section controls.
- [x] Add typed defaults and tests for theme variables, page data, and slug behavior.

### Task 2: Admin foundation
- [x] Replace the single JSON editor with authenticated route-aware CMS navigation.
- [x] Add reusable labeled inputs, toggles, uploaders, repeaters, rich text, and save feedback.

### Task 3: Structured form modules
- [x] Add beginner-friendly forms for settings, products, projects, inquiries, and homepage sections.
- [x] Add logo, favicon, gallery, product image, and PDF uploads with previews.

### Task 4: Visual page builder and frontend
- [x] Add Puck editor with a curated VORTKART block library and save/publish action.
- [x] Render saved visual pages and apply dynamic theme, navigation, footer, CTA, SEO, and favicon settings.

### Task 5: Documentation and verification
- [x] Write a detailed Chinese beginner guide for SQL migration and every CMS module.
- [x] Run tests, type checking, production build, and route checks.
