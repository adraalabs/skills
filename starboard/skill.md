---
name: starboard
description: Pin popular messages to a starboard channel when they reach a reaction threshold. Use when asked for starboard, best-of, or highlight channel.
category: engagement
version: 1
platforms: [discord]
author: adraalabs
---

## Setup

Ask for: starboard channel (show_select type:"channel"), emoji (default ⭐), threshold (default 3).

## Trigger: starboard_check

Event: `reaction_add` with condition: {emoji:"⭐", min_reactions:3}

Actions:
1. `put` key:"starboard:{message.id}" value:"{reaction.count}"
2. `send_embed` to starboard channel: title:"⭐ {reaction.count}", description:"{message.content}", footer:"#{channel.name}", color:"#FFD700", author:{name:"{message.author.name}", icon_url:"{message.author.avatar}"}, buttons:[{id:"jump", label:"Jump to Message", style:"link", url:"{message.url}"}]

## Key rules

- {user} = the person who reacted, {message.author} = who wrote the original message
- Use min_reactions in condition to only fire after threshold
- {message.content} gets the original message text
- {message.url} links back to the original
- Link button (style:"link" + url) doesn't need a handler — Discord opens the URL directly
- send_embed in triggers supports buttons array
