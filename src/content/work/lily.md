---
title: "A private notebook for two, on iOS and Android"
kicker: "Lily · consumer app"
summary: "Couples save places, films, trips and dates in one quiet app. Share a reel or a screenshot — Lily recognises what it is."
client: "SHTAB product"
year: 2026
order: 4
accent: "#8FA37A"
stack: ["SwiftUI", "iOS 18", "Kotlin · Compose", "Bun · Hono", "Postgres", "StoreKit 2", "Railway"]
role: ["Product", "Design", "iOS", "Android", "Backend"]
metrics:
  - { value: "2", label: "platforms, one shared backend" }
  - { value: "4", label: "releases in seven weeks" }
  - { value: "7", label: "app icons to choose from" }
before: "screenshots and links lost in chats"
after: "one shared notebook that remembers"
cover: "/img/work/lily/01-home.webp"
screens:
  - { src: "/img/work/lily/01-home.webp", alt: "Lily home screen with the planner and the «soon» timeline", phone: true }
  - { src: "/img/work/lily/04-places.webp", alt: "Places saved by the couple, with nearby suggestions", phone: true }
  - { src: "/img/work/lily/06-trip.webp", alt: "A trip planned day by day", phone: true }
  - { src: "/img/work/lily/09-our-story.webp", alt: "«Our story» — the couple's timeline", phone: true }
  - { src: "/img/work/lily/10-passport.webp", alt: "Travel passport with visited places", phone: true }
  - { src: "/img/work/lily/03-planner.webp", alt: "Evening planner suggesting what to do", phone: true }
link: "https://apps.apple.com/us/app/lily-notebook-for-two/id6806802609"
linkLabel: "On the App Store"
---

## The idea

Couples collect ideas everywhere: a reel with a restaurant, a screenshot of a film, a link to a cabin for the weekend. Then it all drowns in chats. Lily is a shared notebook that remembers what two people want to live through together, helps them do it, and keeps the story.

The loop is simple: **saw → saved → chose → did → remembered.**

## What we built

**Smart Send.** Share a reel, a screenshot or a link into Lily, and it recognises a place, a film or a book on its own: on-device OCR, then a language model to make sense of it. No typing.

**One home for everything.** Places with a «nearby» view, a shelf of films and books, trips planned day by day, important dates, moments, a wishlist and agreements. Widgets on the home screen, including the tinted ones.

**Rituals, not features.** Postcards in three styles with a flip gesture. «Our story» as a timeline. A travel passport with visited places. The app's design system follows a Japanese house: emptiness, pause, quiet materials.

**Private by design.** Personal notes are encrypted with CryptoKit; the key lives in the user's iCloud Keychain. The pair is created by a code, with Sign in with Apple.

## Under the hood

Native SwiftUI on iOS 18 and Jetpack Compose on Android, synced through our own backend: Bun, Hono and Postgres on Railway, with a custom sync engine. Push notifications via APNs and FCM, purchases through StoreKit 2 with server-side verification, history export to video with AVFoundation.

## Result

Four releases in seven weeks, from an empty repository to the App Store. One codebase per platform, one backend for both, and a product that feels like an object rather than a dashboard.
