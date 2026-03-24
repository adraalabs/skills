---
name: welcome
description: Welcome messages for new members with auto-role and goodbye messages. Use when asked for welcome system, greet new members, or member join messages.
category: community
version: 2
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Ask the user for: welcome channel (show_select type:"channel"), auto-role (show_select type:"role"), and optionally a custom message (show_modal).

## Trigger: welcome_message

Event: `member_join`

Actions:
1. `send_embed` to the welcome channel with: title:"Welcome {user.name}!", description:"{user} just joined **{server}**!\n\nYou are member #{server.members}", thumbnail:"{user.avatar}", color:"#5865F2"
2. `assign_role` the auto-role to {user.id}

For image welcome cards, replace send_embed with:
`send_image_card` channel_id, theme:"dark", avatar_url:"{user.avatar}", name:"{user.displayname}", title:"Welcome!", subtitle:"Member #{server.members}", footer:"{server}"

## Optional: goodbye trigger

Event: `member_leave`

Action: `send_message` to the welcome channel: "{user.name} left the server."

## Key rules

- {user} in member_join = the new member
- {user.avatar} for their profile picture
- {server.members} for current member count
- send_image_card in triggers uses pre-set templates only — no AI generation at runtime
