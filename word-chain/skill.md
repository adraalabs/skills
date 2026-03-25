---
name: word-chain
description: Word chain game — each message must start with the last letter of the previous word. Use when asked for word chain, word game, or shiritori.
category: fun
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Setup

Ask for game channel with show_select(type:"channel").

## Trigger: word_chain_check

Event: `message_create` with condition: {channel_id: "GAME_CHANNEL_ID"}

Actions:
1. `get` key:"wordchain_last" — get the last valid word
2. Check if {message.content} starts with the last letter of the previous word
3. Check if the word was already used: `get` key:"wordchain_used:{message.content}"
4. If valid: `put` key:"wordchain_last" value:"{message.content}", `put` key:"wordchain_used:{message.content}" value:true, `add_reaction` ✅
5. If invalid: `send_message` "Wrong! The word must start with the letter **X**", `put` key:"wordchain_last" value reset

## Command: /wordchain reset

`delete_by_prefix` prefix:"wordchain_"
Template: "Word chain reset! Start with any word."

## Key rules

- Track used words to prevent repeats
- React with ✅ for valid words (less spam than messages)
- The "last letter" logic needs the last character of the previous word
- Only trigger in the designated game channel
- Case insensitive matching
