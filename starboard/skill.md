---
name: starboard
description: Pin popular messages to a starboard channel when they reach a reaction threshold. Use when asked for starboard, best-of, or highlight channel.
category: engagement
version: 3
platforms: [discord]
author: adraalabs
---

## Setup

Ask for: starboard channel (show_select type:"channel"), emoji (default ⭐), threshold (default 3).

## Trigger: starboard

Event: `reaction_add` with condition: {emoji:"⭐", min_reactions:3}

Actions (all with IDs for piping):
1. `{id:"lookup", type:"get_data", key:"starboard:{message.id}", name:"existing"}` — check if already posted
2. `{id:"guard", type:"check", key:"{lookup.existing_value}", operator:"not_exists", then:[
   {id:"mark", type:"store_data", key:"starboard:{message.id}", value:"{reaction.count}"},
   {id:"post", type:"send_embed", channel_id:"STARBOARD_CHANNEL",
     title:"⭐ Starred Message", description:"{message.content}",
     footer:"{reaction.count} ⭐ • #{channel.name}", color:"#FFD700",
     author:{name:"{message.author.name}", icon_url:"{message.author.avatar}"},
     buttons:[{id:"jump", label:"Jump to Message", style:"link", url:"{message.url}"}]}
   ]}`

## Key rules

- Every action has an id — pipe with {id.field}
- {lookup.existing_value} pipes from get_data to the check
- check with not_exists prevents duplicate starboard posts
- {user} = reactor, {message.author} = original author
- min_reactions in condition fires only after threshold
- send_embed supports author, buttons, thumbnail
