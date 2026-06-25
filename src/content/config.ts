import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		author: z.string(),
		image: z.string().optional(),
	}),
});

const bairros = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		bairro: z.string(),
		seoKeyword: z.string().optional(),
	}),
});

const servicos = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		pageTitle: z.string().optional(),
		description: z.string(),
		icon: z.string(),
		image: image().optional(),
		order: z.number().default(0),
		capacity: z.string().optional(),
		dimensions: z.string().optional(),
		rentalPeriod: z.string().optional(),
		benefits: z.array(z.string()).optional(),
		altura: z.string().optional(),
		largura: z.string().optional(),
		comprimento: z.string().optional(),
		volume: z.string().optional(),
		pesoSuportado: z.string().optional(),
		permanencia: z.string().optional(),
		equivalencia: z.string().optional(),
	}),
});

export const collections = { blog, bairros, servicos };
