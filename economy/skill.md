---
name: economy
description: Coins economy with balance, pay, daily rewards, and leaderboard. Use when asked for economy, coins, currency, or money system.
category: economy
version: 2
platforms: [discord, telegram]
author: adraalabs
---

## Commands

### /balance
Single tool: `get_data` key:"coins:{target_id}"
Template: "**{target_name}** has **{value || 0}** coins"

### /pay
Options: user (user, required), amount (integer, required)
Steps:
1. `increment_data` key:"coins:{caller_id}" amount:-"{amount}"
2. `increment_data` key:"coins:{target_id}" amount:"{amount}" name:"recv"
Template: "Sent **{amount}** coins to {target}. Your balance: **{value}**"

### /daily
data_context: {last_claim:"daily:{caller_id}"}
Steps:
1. `store_data` key:"daily:{caller_id}" value:"{timestamp}" ttl_seconds:86400 if:"!last_claim"
2. `increment_data` key:"coins:{caller_id}" amount:100 if:"!last_claim"
Template: uses conditional — already claimed or success message
Cooldown: {seconds:5, per:"user"}

### /rich
Single tool: `list_data` prefix:"coins:" sort:"desc" per_page:10 format:"ranked"
Embed: title:"Richest Members", description:"{entries}"

## Optional: earn coins per message

Trigger on `message_create`: `increment_data` key:"coins:{user.id}" amount:1

## Key rules

- Negative amount in increment_data = deduction
- ttl_seconds:86400 on daily claim = 24h cooldown via data expiry
- data_context pre-fetches a value before steps run — use for conditional checks
- step.if:"!last_claim" = only run if last_claim is falsy (expired or never claimed)
