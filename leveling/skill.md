---
name: leveling
description: XP per message, levels, rank cards with image, and leaderboard. Use when asked for leveling, XP, ranking, or experience system.
category: engagement
version: 3
platforms: [discord, telegram]
author: adraalabs
---

## Trigger: xp_gain

Event: `message_create`

Action: `{id:"xp", type:"increment_data", key:"xp:{user.id}", amount:1}`

Only add cooldown if user asks for anti-spam.

## Command: /rank

Steps:
1. `rank` prefix:"xp:" key:"xp:{target_id}" name:"rank"
2. `render_image` theme:"ocean" user_id:"{target_id}" title:"Rank Card" fields:[{label:"Level", value:"{math:floor(rank_value/100)}"}, {label:"Rank", value:"#{rank_position} / {rank_total}"}, {label:"XP", value:"{rank_value}"}] progress:{value:"{math:rank_value % 100}", max:100} subtitle:"{math:100 - rank_value % 100} XP to next level"
3. template:" "

## Command: /top

Steps:
1. `list` prefix:"xp:" sort:"desc" per_page:10 format:"ranked" name:"lb"
2. `render_image` title:"XP Leaderboard" rows:"{lb_entries}" theme:"gold" footer:"{server}"
3. template:" "

## Key rules

- Every trigger action has an id — pipe with {id.field}
- {xp.incremented_value} available after increment_data
- Level = {math:floor(value/100)} — every 100 XP = 1 level
- render_image in commands generates image attached to reply
- Data key: "xp:{user.id}" in triggers, "xp:{target_id}" in commands
