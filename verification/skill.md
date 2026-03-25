---
name: verification
description: Member verification gate — new members must click a button or solve a captcha to get access. Prevents raids and bots. Use when asked for verification, captcha, gate, or anti-raid.
category: moderation
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Setup

Ask for: verified role (show_select type:"role"), verification channel (show_select type:"channel").

## Step 1: Create verification panel

`send_interactive` to verification channel:
- embed: title:"Verify", description:"Click the button below to get access to the server.", color:"#5865F2"
- buttons: [{id:"verify_member", label:"Verify", style:"success", emoji:"✅"}]

## Step 2: Register button handler

`put` key:"interaction:verify_member" value:
- tool: "assign_role"
- args: {user_id:"{caller}", role_id:"VERIFIED_ROLE_ID"}
- response: "You're verified! Welcome to the server."
- unique_per_user: true

## Optional: CAPTCHA verification

For higher security, use a modal instead of a simple button:
- modal: {title:"Verification", fields:[{id:"answer", label:"What is 5 + 3?", placeholder:"Type the answer"}]}
- steps: check if {answer} == "8", if correct assign role, if wrong respond with error

## Optional: Auto-kick unverified

Create a `cron` trigger that runs daily:
- List members without the verified role
- Kick those who joined more than 24h ago and still aren't verified

## Key rules

- The verified role should gate all other channels via channel permissions
- unique_per_user prevents clicking verify multiple times
- For Telegram: use callback_query event instead of buttons
- For CAPTCHA: randomize the question by using {random:1-10} + {random:1-10} and computing the expected answer
- Consider adding a log: put key:"verified:{caller_id}" value:"{timestamp}"
