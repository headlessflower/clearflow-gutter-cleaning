// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { cityLandingPages } from "./data/cityLandingPages"; // adjust if your path differs

const cityRoutes = Object.keys(cityLandingPages).map(
    (slug) => `/gutter-cleaning-${slug}-ca`
);

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@nuxtjs/supabase", 'nuxt-gtag'],

  supabase: {
    redirect: false,
    types: "~/types/supabase.ts",
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL || "https://www.clearflowgutters.pro",
    },
    adminEmails: process.env.ADMIN_EMAILS as string || "",
  },
  nitro: {
    prerender: {
      routes: [
        "/",                // homepage
        ...cityRoutes,      // /gutter-cleaning-pasadena-ca, etc.
      ],
    },
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
  },
});