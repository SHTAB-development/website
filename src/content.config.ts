import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* Кейсы: один .md на проект. Порядок на сайте задаёт `order`. */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),            // короткая подпись над заголовком
    summary: z.string(),           // одно предложение для карточки
    client: z.string(),
    year: z.number(),
    order: z.number(),
    accent: z.string().default('#C9A24B'),
    stack: z.array(z.string()),
    role: z.array(z.string()),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).min(2).max(4),
    before: z.string(),            // «до → после» одной строкой
    after: z.string(),
    cover: z.string(),             // путь в /public
    screens: z.array(z.object({ src: z.string(), alt: z.string(), phone: z.boolean().default(false) })).default([]),
    link: z.string().url().optional(),
    linkLabel: z.string().optional(),
    nda: z.string().optional(),    // почему без ссылки / без имени
  }),
});

export const collections = { work };
