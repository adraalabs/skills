---
name: giveaway
description: Timed giveaways with reaction entries, live entry count, end time, and winner selection. Use when asked to set up a giveaway, raffle, or prize drawing.
category: engagement
version: 5
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/giveaway` with options: prize (string, required), duration (integer, minutes, default 10), winners (integer, default 1).

The command steps:
1. `increment_data` key:"giveaway_counter" name:"counter"
2. `send_message` to current channel with embed:
   - title: "{prize}"
   - description: "React with 🎉 to enter!\n\nHosted by: {caller}"
   - fields: [{name:"Entries", value:"0", inline:true}, {name:"Host", value:"{caller_name}", inline:true}, {name:"Ends", value:"<t:{math:timestamp + duration * 60}:R>", inline:true}]
   - color: "#FFD700"
   - footer: "Giveaway #{counter_value}"
   - name: "msg" (to get {msg_message_id})
3. `store_data` key:"giveaway:{msg_message_id}" value:{prize, host_id:{caller_id}, host_name:{caller_name}, winners}
4. `add_reaction` 🎉 to {msg_message_id}

## Trigger: giveaway_entry

Event: `reaction_add` with condition `{emoji: "🎉"}`

Actions:
1. `store_data` key:"giveaway_entry:{message.id}:{user.id}" value:"{user.id}" if_not_exists:true
2. `increment_data` key:"giveaway_count:{message.id}"
3. `edit_message` — update ONLY the Entries field: embed:{fields:[{name:"Entries", value:"{incremented_value}", inline:true}]}

## IMPORTANT — commands vs triggers

Commands use EXECUTOR TOOLS: send_message, store_data, increment_data, get_data, render_image, etc.
Triggers use TRIGGER ACTIONS: send_message, store_data, increment_data, get_data, check, extract, set_context, etc.

DO NOT use trigger-only actions (check, extract, set_context, foreach_mention) as slash command steps — they don't exist in the executor.

For computed values in commands, use {math:expression} INLINE in the text — don't use set_context.
Example: `<t:{math:timestamp + duration * 60}:R>` computes the end time directly in the embed field.

## Key rules

- **Ends field** uses `<t:{math:timestamp + duration * 60}:R>` — computed inline, no set_context needed
- **{user} in reaction triggers = the reactor**, not the message author
- **Always filter by emoji**: condition:{emoji:"🎉"}
- **edit_message merges** — only specify fields you want to change
- **{incremented_value}** only available after increment_data in the same chain
- Use `store_data` with `if_not_exists:true` for entries to prevent double-counting
- Duration option should default to 10 if not provided
