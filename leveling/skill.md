---
name: leveling
description: XP per message, levels, rank cards with image, and leaderboard. Use when asked for leveling, XP, ranking, or experience system.
category: engagement
version: 2
platforms: [discord, telegram]
author: adraalabs
---

## Trigger: xp_gain

Event: `message_create`

Action: `increment_data` key:"xp:{user.id}" amount:1

Only add cooldown if user asks for anti-spam.

## Command: /rank

Steps:
1. `get_position` prefix:"xp:" key:"xp:{target_id}" name:"rank"
2. `render_image` theme:"ocean" user_id:"{target_id}" title:"Rank Card" fields:[{label:"Level", value:"{math:floor(rank_value/100)}"}, {label:"Rank", value:"#{rank_position} / {rank_total}"}, {label:"XP", value:"{rank_value}"}] progress:{value:"{math:rank_value % 100}", max:100} subtitle:"{math:100 - rank_value % 100} XP to next level"
3. template:" "

## Command: /top

Steps:
1. `list_data` prefix:"xp:" sort:"desc" per_page:10 format:"ranked" name:"lb"
2. `render_image` title:"XP Leaderboard" rows:"{lb_entries}" theme:"gold" footer:"{server}"
3. template:" "

## Key rules

- Level = {math:floor(value/100)} — every 100 XP = 1 level
- Progress = {math:value % 100} out of 100
- template:" " required when render_image is the reply
- No emoji in render_image text
- user_id auto-fills avatar and display name
- Data key: "xp:{user.id}" in triggers, "xp:{target_id}" in commands
