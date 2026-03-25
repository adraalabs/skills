---
name: auto-roles
description: Automatically assign roles on join, or let users pick roles via reaction/button menus. Use when asked for auto-role, self-assign roles, reaction roles, or role menu.
category: community
version: 1
platforms: [discord]
author: adraalabs
---

## Option A: Auto-role on join

Trigger on `member_join`:
Action: `assign_role` role_id:"ROLE_ID"

Ask which role with show_select(select_type:"role").

## Option B: Reaction roles

1. `send_interactive` with embed listing available roles + buttons for each:
   buttons:[{id:"role_ROLEID1", label:"Gamer", emoji:"🎮"}, {id:"role_ROLEID2", label:"Artist", emoji:"🎨"}]

2. For each button, `put` key:"interaction:role_ROLEID" value:{tool:"assign_role", args:{user_id:"{caller}", role_id:"ROLEID"}, response:"Role assigned!"}

## Option C: Select menu roles

1. `send_interactive` with select_menu:{id:"role_picker", placeholder:"Pick your roles", options:[{label:"Gamer", value:"role_ROLEID1", emoji:"🎮"}, {label:"Artist", value:"role_ROLEID2", emoji:"🎨"}]}

2. For each option value, `put` key:"interaction:role_ROLEID" value:{tool:"assign_role", args:{user_id:"{caller}", role_id:"ROLEID"}, response:"{caller} got the role!"}

## Key rules

- Ask which roles with show_select(select_type:"role") — native Discord role picker
- Button IDs must be unique — include the role ID
- {caller} in button/select handlers = the person who clicked
- For toggle (assign if missing, remove if has), use steps with conditional logic
