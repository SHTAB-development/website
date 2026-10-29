/* Приём заявок: валидация → Telegram + почта. Единственный серверный маршрут сайта. */
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

const env = (k: string) => process.env[k]?.trim() || '';
const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/* простой лимит: 8 заявок в час с одного адреса */
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
};

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

async function sendTelegram(text: string) {
  const token = env('TELEGRAM_BOT_TOKEN'), chat = env('TELEGRAM_CHAT_ID');
  if (!token || !chat) return false;
  const thread = Number(env('TELEGRAM_THREAD_ID')) || undefined; // топик «Заявки» в группе с форумом
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, message_thread_id: thread, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
  return true;
}

async function sendMail(subject: string, text: string, replyTo: string) {
  const host = env('SMTP_HOST'), user = env('SMTP_USER'), pass = env('SMTP_PASS'), to = env('LEAD_TO') || user;
  if (!host || !user || !pass) return false;
  const port = Number(env('SMTP_PORT') || 465);
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, connectionTimeout: 8000, socketTimeout: 10000 });
  await transport.sendMail({ from: `SHTAB site <${user}>`, to, subject, text, replyTo: replyTo || undefined });
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json(400, { ok: false, code: 'bad_json', message: 'Expected JSON' }); }

  if (clean(body.website, 50)) return json(200, { ok: true }); // honeypot: боту отвечаем «ок» и ничего не шлём

  const task = clean(body.task, 2000), contact = clean(body.contact, 200), name = clean(body.name, 100);
  if (task.length < 2 || contact.length < 2) return json(400, { ok: false, code: 'invalid', message: 'Task and contact are required' });
  if (limited(clientAddress)) return json(429, { ok: false, code: 'rate_limited', message: 'Too many requests, try later' });

  const page = clean(request.headers.get('referer'), 300);
  const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const tg = [
    '<b>New lead · devshtab.com</b>',
    '',
    `<b>Task:</b> ${esc(task)}`,
    `<b>Contact:</b> ${esc(contact)}`,
    name && `<b>Name:</b> ${esc(name)}`,
    '',
    `<i>${when}${page ? ' · ' + esc(page) : ''}</i>`,
  ].filter((l) => l !== '').join('\n');
  const mail = `Task:\n${task}\n\nContact: ${contact}\n${name ? `Name: ${name}\n` : ''}\n${when}${page ? '\n' + page : ''}`;
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : '';

  const results = await Promise.allSettled([sendTelegram(tg), sendMail(`Lead from the site: ${name || contact}`, mail, replyTo)]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value === true);
  const configured = results.some((r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === true));
  for (const r of results) if (r.status === 'rejected') console.error('[lead] delivery failed:', r.reason?.message ?? r.reason);

  if (delivered) return json(200, { ok: true });
  if (!configured) return json(503, { ok: false, code: 'not_configured', message: 'Lead delivery is not configured' });
  return json(500, { ok: false, code: 'delivery_failed', message: 'Could not deliver the lead' });
};
