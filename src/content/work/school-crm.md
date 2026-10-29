---
title: "One system for a school with four branches"
kicker: "Znaniye · school CRM"
summary: "350 students, four branches, paper forms and ten-day queues — replaced with a three-minute application, a phone-first register and one screen for the director."
client: "Znaniye Russian School, London"
year: 2026
order: 2
accent: "#8FA3C7"
stack: ["Django", "PostgreSQL", "Email automation", "Railway"]
role: ["Research", "Process design", "Development"]
metrics:
  - { value: "350", label: "students tracked in one system" }
  - { value: "4", label: "branches in a single CRM" }
  - { value: "3", label: "minutes to file an application, down from 10 days" }
before: "paper form · 10 days"
after: "application in 3 minutes"
cover: "/img/work/school-crm/dashboard.webp"
screens:
  - { src: "/img/work/school-crm/crm.webp", alt: "Admissions board: new → contacted → trial day → enrolled" }
  - { src: "/img/work/school-crm/dashboard.webp", alt: "Director's summary: students, attendance, registers, applications by branch" }
  - { src: "/img/work/school-crm/register.webp", alt: "Attendance register on a phone: big buttons for the teacher", phone: true }
nda: "Screens are from the demo environment: every family and child shown is fictional."
---

## The task

Znaniye is a Russian Saturday school in London: four branches, 350 students every weekend, an accredited Pearson Edexcel exam centre. It ran on paper: application forms, exam lists, attendance registers. An application took up to ten days to process, and the director had no single picture of the school.

## What we built

**Admissions in three minutes.** A parent fills in a form online, gets an automatic email and a family number. The office sees the application on a board and moves it through the stages: new → contacted → trial day → enrolled. Tasks and responsible staff live on the same board.

**A register that works in a corridor.** Teachers mark attendance from the phone: big buttons, allergies and parents' numbers at hand, a note when the lesson is over and the register is read-only.

**One screen for the director.** Students, attendance, filled registers and applications in progress — for the whole school or per branch, with CSV exports for the accountant. Safeguarding data, exam cohorts and notifications are in the same system.

## Result

Ten days became three minutes. Four branches work in one system, and the director runs the school from one screen instead of four folders. The system is in alpha with the school; the finance module is next.
