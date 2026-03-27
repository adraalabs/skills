---
name: welcome
description: Welcome messages for new members with auto-role and goodbye messages. Use when asked for welcome system, greet new members, or member join messages.
category: community
version: 3
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Ask the user for: welcome channel (show_select type:"channel"), auto-role (show_select type:"role"), and optionally a custom message (show_modal).

## Trigger: welcome_message

Event: `member_join`

Actions:
1. `{id:"greet", type:"send_embed"}` to the welcome channel with: title:"Welcome {user.name}!", description:"{user} just joined **{server}**!\n\nYou are member #{server.members}", thumbnail:"{user.avatar}", color:"#5865F2"
2. `{id:"role", type:"assign_role"}` the auto-role to {user.id}

For image welcome cards, use render_image + send_message with attachment piping:
1. `{id:"img", type:"render_image"}` theme:"dark", avatar_url:"{user.avatar}", name:"{user.displayname}", title:"Welcome!", subtitle:"Member #{server.members}", footer:"{server}"
2. `{id:"msg", type:"send_message"}` channel_id:CHANNEL, message:"Welcome {user}!", attachment:"img"
3. `{id:"role", type:"assign_role"}` role_id:ROLE

## Optional: goodbye trigger

Event: `member_leave`

Action: `{id:"bye", type:"send_message"}` to the welcome channel: "{user.name} left the server."

## Key rules

- Every action MUST have an id field for output piping
- {user} in member_join = the new member
- {user.avatar} for their profile picture
- {server.members} for current member count
- For image cards: render_image (id:"img") → send_message (attachment:"img")
- Reference previous action results as {id.field}, e.g. {greet.sent_message_id}
