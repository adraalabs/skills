---
name: starboard
description: Pin popular messages to a starboard channel when they reach a reaction threshold. Use when asked for starboard, best-of, or highlight channel.
category: engagement
version: 2
platforms: [discord]
author: adraalabs
---

## Setup

Ask for: starboard channel (show_select type:"channel"), emoji (default ⭐), threshold (default 3).

## Trigger: starboard

Event: `reaction_add` with condition: {emoji:"⭐", min_reactions:3}

Actions:
1. `get_data` key:"starboard:{message.id}" name:"existing" — check if already posted
2. `check` key:"existing_exists" operator:"==" value:"false" — skip if already starred
3. `store_data` key:"starboard:{message.id}" value:"{reaction.count}" — mark as posted
4. `send_embed` to starboard channel:
   - title:"⭐ Starred Message"
   - description:"{message.content}"
   - footer:"{reaction.count} ⭐ • #{channel.name}"
   - color:"#FFD700"
   - author:{name:"{message.author.name}", icon_url:"{message.author.avatar}"}
   - thumbnail:"{message.author.avatar}"
   - buttons:[{id:"jump", label:"Jump to Message", style:"link", url:"{message.url}"}]

## Key rules

- {user} = the person who reacted, {message.author} = who wrote the original message
- Use min_reactions in condition to only fire after threshold
- get_data + check prevents duplicate posts when more people react after threshold
- {message.content} {message.url} {message.author.*} are all built-in for reaction_add — no http_fetch needed
- Link button (style:"link" + url) opens the URL directly, no handler needed
- send_embed supports author:{name, icon_url} and buttons array
