---
title: "A CRM that answers marketplace buyers like a live manager"
kicker: "Marketplace sales · Avito"
summary: "A clothing store gets fifty messages a day. The bot answers in seconds, the owner confirms deals in Telegram, and every conversation lands in the CRM."
client: "Clothing store on Avito"
year: 2026
order: 3
accent: "#C9A24B"
stack: ["FastAPI", "Claude API", "Avito API", "Telegram", "Railway"]
role: ["Process design", "Backend", "Integration"]
metrics:
  - { value: "50", label: "conversations a day without the owner" }
  - { value: "6", label: "seconds to the first reply" }
  - { value: "24/7", label: "nights, weekends, seasonal peaks" }
before: "a full working day of chat"
after: "a reply in 6 seconds"
cover: "/img/work/avito-crm/cover.svg"
screens: []
---

## The task

A seller on Avito, a classifieds marketplace, gets around fifty messages from buyers a day. Answering each one by hand is a full working day of chat, and the ones that arrive at night are lost by morning.

## What we built

**A seller that never sleeps.** The bot reads the listing, the stock and the conversation, and replies like a person: clarifies the size, checks availability, offers delivery. It is built on the Claude API with a tight brief about what the store can and cannot promise.

**The owner stays in control.** Every deal is confirmed in Telegram with one tap. If a conversation goes off-script, the bot hands it over instead of improvising.

**Nothing gets lost.** Every inquiry is a card in the CRM: status, history, reminders. The owner opens it in the morning and sees what happened overnight.

## Result

Around fifty dialogues a day run without the owner. The first reply goes out in seconds at any hour, and seasonal peaks no longer mean lost buyers.
