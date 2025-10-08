// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://capitalyx.com',
    build: {
      format: 'directory' // URLs propres (/guides/ au lieu de /guides.html)
    },
	integrations: [
		starlight({
			title: 'Capitalyx Wiki',
			description: 'Wiki officiel du serveur Capitalyx',
			defaultLocale: 'root', // Français comme langue par défaut à la racine
			locales: {
				root: {
					label: 'Français',
					lang: 'fr',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
				es: {
					label: 'Español',
					lang: 'es',
				},
			},
			// logo: {
			// 	light: '/assets/logo-light.svg',
			// 	dark: '/assets/logo-dark.svg',
			// 	replacesTitle: true,
			// },
			social: [
				{
					icon: 'discord',
					label: 'Discord',
					href: 'https://discord.gg/capitalyx',
				},
			],
			sidebar: [
				{
					label: 'Accueil',
					translations: {
						en: 'Home',
						es: 'Inicio',
					},
					link: '/',
				},
				{
					label: 'Règlement',
					translations: {
						en: 'Rules',
						es: 'Reglas',
					},
					link: '/rules/',
				},
				{
					label: 'Guides',
					translations: {
						en: 'Guides',
						es: 'Guías',
					},
					items: [
						{
							label: 'Guide Débutant',
							translations: {
								en: 'Beginner Guide',
								es: 'Guía para Principiantes',
							},
							link: '/guides/',
						},
					],
				},
				{
					label: 'Métiers',
					translations: {
						en: 'Jobs',
						es: 'Trabajos',
					},
					autogenerate: { directory: 'jobs' },
				},
				{
					label: 'Commandes',
					translations: {
						en: 'Commands',
						es: 'Comandos',
					},
					link: '/commands/',
				},
				{
					label: 'FAQ',
					translations: {
						en: 'FAQ',
						es: 'FAQ',
					},
					link: '/faq/',
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
