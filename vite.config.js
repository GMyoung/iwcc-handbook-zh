import { defineConfig } from 'vite'

export default defineConfig({ base: process.env.GITHUB_REPOSITORY?.endsWith('iwcc-handbook-zh') ? '/iwcc-handbook-zh/' : '/' })
