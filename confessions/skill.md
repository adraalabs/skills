---
name: confessions
description: Anonymous confession system — users submit via DM or modal, bot posts anonymously with a unique number. Use when asked for confessions, anonymous posting, or secrets channel.
category: fun
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Command: /confess

Config:
- modal: {title:"Anonymous Confession", fields:[{id:"confession", label:"Your confession", style:"paragraph", placeholder:"This stays completely anonymous..."}]}
- steps:
  1. `increment_data` key:"confession_counter" name:"num"
  2. `send_message` to confessions channel: embed:{title:"Confession #{num_value}", description:"{confession}", color:"#2F3136", footer:"Anonymous"}
- response: "Your confession has been posted anonymously!"
- ephemeral: true

## Key rules

- Modal collects the confession — user never types it publicly
- Response is ephemeral — only the confessor sees the confirmation
- The confession message has NO reference to who sent it
- {confession} from the modal is available in subsequent steps
- Use confession_counter for unique numbering
- Never store the author's ID with the confession — true anonymity
- Consider adding a report button for admins to investigate abuse
