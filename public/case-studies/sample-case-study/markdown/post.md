---
title: Migrating from React SPA to Next.js
date: '2025-02-01'
excerpt: >-
  How I migrated TerenceWaters.com from a React-based Static Web App to a
  Next.js App Router site.
tags:
  - migration
  - nextjs
  - azure
---

# Migrating from React SPA to Next.js

## The Challenge

The original TerenceWaters.com was built as a React SPA using Fluent UI and hosted on Azure Static Web Apps. While functional, it lacked Static Site Generation, which meant slower initial page loads and limited SEO capability.

## The Solution

Rebuild using Next.js App Router with SSG via `generateStaticParams`, preserving all existing theming.
