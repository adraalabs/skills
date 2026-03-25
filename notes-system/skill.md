---
name: notes-system
description: Saved replies/notes system — admins save text snippets, anyone can retrieve them. Replicates @MissRose_bot /save, /get, /notes. Use when asked for notes, saved replies, FAQ, or quick responses.
category: utility
version: 1
platforms: [telegram]
author: adraalabs
---

## Overview

Simple key-value note storage. Admins save text, anyone can retrieve by name.

## Commands

### /save
Options: name (string, required)

The note content comes from the REST of the message after the name, OR from a replied-to message.

Steps:
1. `put` key:"note:{name}" value:"{content}"
2. `send_message` text:"Saved note <b>{name}</b>"

Where {content} is:
- If command has text after the name: use that text
- If replying to a message: use the replied message text
- If neither: return error "Provide note content or reply to a message"

### /get
Options: name (string, required)
Tool: `get` key:"note:{name}"
If value exists: send_message with the note content
If not: "Note '{name}' not found. Use /notes to see available notes."

Alternative shortcut: `#name` (hash + note name) retrieves the note.
Create a trigger on `message_keyword` with regex `^#(\w+)` to handle this.

### /notes
Tool: `list` prefix:"note:" format:"raw"
Template: list all note names as a bulleted list
If empty: "No notes saved. Use /save {name} {content} to create one."

### /delnote
Options: name (string, required)
Steps:
1. `delete` key:"note:{name}"
2. `send_message` text:"Deleted note <b>{name}</b>"

### /clearnotes
Steps:
1. `delete_by_prefix` prefix:"note:"
2. `send_message` text:"All notes cleared."

## Trigger: hash_shortcut

Event: `message_keyword`
Condition: `{ "keywords": ["^#(\\w+)$"], "match": "regex" }`

Actions:
1. `extract` from:"message.text" operation:"replace" find:"^#" replace_with:"" name:"note_name"
2. `get_data` key:"note:{note_name}" name:"note"
3. `check` key:"note_exists" operator:"==" value:"true"
4. `send_message` message:"{note_value}"

If note doesn't exist, do nothing (silent fail — don't spam on random hash words).

## Key rules

- Note names should be lowercase, alphanumeric + underscores only
- Note content supports Telegram HTML formatting
- /save and /delnote require admin permissions
- /get and /notes are available to everyone
- The #shortcut trigger should silently fail if note doesn't exist
- Maximum note content: 4096 characters (Telegram message limit)
- Consider adding /savemd for notes with formatting
