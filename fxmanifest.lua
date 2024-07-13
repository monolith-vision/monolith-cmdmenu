fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Open Source by Monolith Vision and Contributors'
version '1.0.0'
description 'A menu to look up existing commands or actions.'

debug_mode 'true';
allowed_logs {
  'warn',
  'error',
  'info',
}

ui_page 'web/dist/index.html'
files {
  'web/dist/**',
  -- Shared Modules
  'shared/modules/console.lua',
  -- Client Modules
  'client/modules/input.lua',
  'client/modules/nui.lua',
}

shared_scripts {
  'shared/main.lua',
  'shared/config.lua',
  'shared/lib/require.lua',
  'shared/classes/actions.lua',
}

client_script 'client/main.lua'

server_scripts {
  'server/version.lua',
  'server/main.lua'
}
