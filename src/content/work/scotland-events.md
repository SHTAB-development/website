---
title: "A ticketing platform the organiser runs herself"
kicker: "Events · Scotland"
summary: "Balls and family fairs for the international community of Fife: table selection on a hall map, Stripe payments, QR tickets and a dashboard for one person."
client: "Private events organiser, Kirkcaldy"
year: 2026
order: 1
accent: "#C9A24B"
stack: ["Next.js 16", "React 19", "Postgres · Drizzle", "Stripe", "Railway"]
role: ["Research", "Prototype", "Design", "Development"]
metrics:
  - { value: "2", label: "weeks from brief to production" }
  - { value: "35", label: "minutes a chosen table is held during checkout" }
  - { value: "2", label: "languages, English and Russian" }
before: "tickets sold in chats and by bank transfer"
after: "pick a table, pay, get a QR"
cover: "/img/work/scotland/cover.webp"
screens:
  - { src: "/img/work/scotland/hall.webp", alt: "Hall map with table selection and the booking panel" }
  - { src: "/img/work/scotland/event.webp", alt: "Event page: when, where, dress code and the programme" }
  - { src: "/img/work/scotland/organiser.webp", alt: "Organiser dashboard: tables sold, tickets, revenue, editor" }
  - { src: "/img/work/scotland/gallery.webp", alt: "Photo gallery with albums" }
nda: "The site is live, but we don't publish the link at the client's request."
---

## The task

One organiser in Kirkcaldy runs balls, family fairs and evenings for the Russian-speaking and international community of Scotland. Every event has three parts in one: a programme for children, time to meet people, and an evening programme. Tickets were sold through messengers, tables were assigned by hand, and the night before each event was spent reconciling lists.

She needed a site where guests choose a table and pay on their own, and where she runs everything without a developer.

## What we built

**Tables on a map.** The hall map is generated from table zones, so a new venue takes minutes to set up. A guest picks a table, and it is held for 35 minutes while they pay through Stripe Checkout. Refunds flow back through a webhook.

**Tickets that work at the door.** Every order gets a QR ticket by email. At the entrance, the organiser scans it with her phone's camera, right in the browser.

**A dashboard for one person.** Events, zones, prices, photos and the poster are edited in her own admin panel. Guest lists export to CSV. Applications from partners, artists, volunteers and vendors arrive through a four-step form and land in the same place.

**Gallery and two languages.** Albums with a masonry layout and a lightbox; photos are processed on upload. The whole site switches between English and Russian.

## How it went

We started with a clickable one-file prototype, agreed the flow with the client in two days, and built the real product on Next.js, Postgres and Stripe. From the first call to a production build: two weeks.
