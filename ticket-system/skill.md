---
name: ticket-system
description: Support ticket system with private channels, modal forms, and close button. Use when asked for tickets, support system, or help desk.
category: moderation
version: 2
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Ask for: ticket category/channel (show_select type:"channel"), staff role (show_select type:"role").

## Step 1: Create ticket panel

Use `send_interactive` to the support channel with:
- embed: title:"Support Tickets", description:"Click below to create a ticket", color:"#5865F2"
- buttons: [{id:"create_ticket", label:"Create Ticket", style:"primary", emoji:"🎫"}]

## Step 2: Register button handler

`put` key:"interaction:create_ticket" value:
- modal: {title:"Create Ticket", fields:[{id:"issue", label:"Describe your issue", style:"paragraph", placeholder:"What do you need help with?"}]}
- steps: [{tool:"create_private_channel", args:{name:"ticket-{caller_id}", user_id:"{caller}", category_id:"CATEGORY_ID"}, name:"ch"}, {tool:"send_message", args:{channel_id:"{ch_channel_id}", embed:{title:"Ticket", description:"**Issue:**\n{issue}\n\nA staff member will help you soon.", color:"#5865F2"}, buttons:[{id:"close_ticket_{ch_channel_id}", label:"Close Ticket", style:"danger"}]}}]
- response: "Ticket created! Check <#{ch_channel_id}>"
- ephemeral: true

## Step 3: Close button handler

`put` key:"interaction:close_ticket_{ch_channel_id}" value:
- tool:"delete_channel", args:{channel_id:"{ch_channel_id}"}
- response:"Ticket closed."

## Key rules

- Modal collects issue description before creating the channel
- Private channel only visible to the user + bot + staff role
- {issue} from modal is available as a placeholder in subsequent steps
- Close button deletes the channel entirely
- Use unique_per_user on create_ticket to prevent spam
