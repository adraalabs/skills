# Adraa Skills

Open-source skills for the [Adraa](https://adraa.ai) Discord bot. Each skill teaches the AI how to build a feature correctly.

## What are skills?

Skills are markdown instructions that teach the Adraa bot how to compose features from atoms (commands, triggers, data store). They're not rigid configs — the AI adapts each skill to your server's needs while following proven patterns.

## Available Skills

| Skill | Category | Description |
|-------|----------|-------------|
| [giveaway](giveaway/skill.md) | engagement | Timed giveaways with reaction entries and live count |
| [leveling](leveling/skill.md) | engagement | XP, levels, rank cards, leaderboard |
| [welcome](welcome/skill.md) | community | Welcome messages, auto-role, goodbye |
| [ticket-system](ticket-system/skill.md) | moderation | Support tickets with modal forms and private channels |
| [starboard](starboard/skill.md) | engagement | Pin popular messages to a highlight channel |
| [economy](economy/skill.md) | economy | Coins, balance, pay, daily rewards |
| [invite-tracker](invite-tracker/skill.md) | community | Track who invited whom, invite leaderboard |
| [auto-roles](auto-roles/skill.md) | community | Auto-assign or self-pick roles |
| [polls](polls/skill.md) | engagement | Polls with buttons and live vote counts |
| [birthday](birthday/skill.md) | community | Birthday tracking and announcements |

## How to use

Just ask your Adraa bot:

> "@Adraa set up a giveaway system"

The bot searches for a matching skill, follows the instructions, and builds it for your server.

## Contributing

1. Fork this repo
2. Create a new folder with `skill.md`
3. Follow the format: YAML frontmatter + setup instructions + key rules
4. Submit a PR

### Skill format

```markdown
---
name: my-skill
description: What this skill does. Use when asked for...
category: engagement | moderation | economy | community | fun | utility
version: 1
author: your-name
---

## Setup instructions

Step by step, what to create and how.

## Key rules

Gotchas, critical patterns, things the AI must not get wrong.
```

## License

MIT
