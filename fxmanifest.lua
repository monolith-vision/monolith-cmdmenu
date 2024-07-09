fx_version 'cerulean'
game 'gta5'
lua54 'yes'

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

server_script 'server/main.lua'
