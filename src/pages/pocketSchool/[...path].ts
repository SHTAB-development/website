/* devshtab.com/pocketSchool — промо-сайт PocketSchool (репозиторий SHTAB-development/PocketSchool).
 * Он живёт своим сервисом на Railway и собран под префикс /pocketSchool, а здесь только
 * проксируется: копия его сборки в этом репозитории разошлась бы с оригиналом на первой правке. */
import type { APIRoute } from 'astro';

export const prerender = false;

const UPSTREAM = process.env.POCKETSCHOOL_ORIGIN?.trim() || 'https://school-in-a-pocket.up.railway.app';

/* заголовки, которые отдаём как есть; остальные (длина, кодирование, hop-by-hop) пересчитает Node */
const PASS = ['content-type', 'cache-control', 'etag', 'last-modified', 'location'];

export const GET: APIRoute = async ({ request, url }) => {
  const etag = request.headers.get('if-none-match');
  const upstream = await fetch(UPSTREAM + url.pathname + url.search, {
    headers: { accept: request.headers.get('accept') ?? '*/*', ...(etag ? { 'if-none-match': etag } : {}) },
    redirect: 'manual',
  });
  const headers = new Headers();
  for (const name of PASS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value.replace(UPSTREAM, ''));
  }
  return new Response(upstream.status === 304 ? null : upstream.body, { status: upstream.status, headers });
};

export const HEAD = GET;
