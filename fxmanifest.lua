fx_version 'cerulean'
game 'gta5'
lua54 'yes'

debug_mode 'true';
allowed_logs {
  'warn',
  'error',
  -- 'info',
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
  'shared/lib/require.lua',
  'shared/classes/actions.lua',
  'shared/config.lua',
  'shared/main.lua'
}

client_script 'client/main.lua'

server_script 'server/main.lua'
