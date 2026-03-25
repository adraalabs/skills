---
name: giveaway
description: Timed giveaways with reaction entries, live entry count, end time, and winner selection. Use when asked to set up a giveaway, raffle, or prize drawing.
category: engagement
version: 6
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/giveaway` with options: prize (string, required), duration (integer, minutes, default 10), winners (integer, default 1).

The command steps:
1. `increment` key:"giveaway_counter" name:"counter"
2. `send_message` to current channel with embed:
   - title: "{prize}"
   - description: "React with 🎉 to enter!"
   - fields: [{name:"Entries", value:"0", inline:true}, {name:"Host", value:"{caller}", inline:true}, {name:"Ends", value:"<t:{math:timestamp + duration * 60}:R>", inline:true}]
   - color: "#FFD700"
   - footer: "Giveaway #{counter_value}"
   - name: "msg" (to get {msg_message_id})
3. `put` key:"giveaway:{msg_message_id}" value:{prize, host_id:{caller_id}, host_name:{caller_name}, winners, channel_id:{channel_id}}
4. `add_reaction` 🎉 to {msg_message_id}
5. `timeout` name:"end_giveaway_{msg_message_id}" delay_seconds:"{math:duration * 60}" actions:[
   {type:"list_data", prefix:"giveaway_entry:{msg_message_id}:", name:"entries"},
   {type:"send_message", channel_id:"{channel_id}", message:"🎉 **Giveaway ended!**\n\nPrize: **{prize}**\n{entries_count} entries\n\nWinners picked from reactions — use `pick_random_reactor`!"},
   {type:"edit_message", channel_id:"{channel_id}", message_id:"{msg_message_id}", embed:{fields:[{name:"Entries", value:"{entries_count}", inline:true}, {name:"Status", value:"ENDED", inline:true}]}}
   ]

## Trigger: giveaway_entry

Event: `reaction_add` with condition `{emoji: "🎉"}`

Actions:
1. `put` key:"giveaway_entry:{message.id}:{user.id}" value:"{user.id}" if_not_exists:true
2. `increment` key:"giveaway_count:{message.id}"
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
- Use `put` with `if_not_exists:true` for entries to prevent double-counting
- Duration option should default to 10 if not provided
- **Auto-end**: `timeout` creates a one-time cron trigger that fires after the duration. delay_seconds accepts {math:duration * 60}.
- The scheduled trigger uses actions (trigger actions, NOT executor tools) — list_data, send_message, edit_message
- Max delay: 7 days (604800 seconds)
