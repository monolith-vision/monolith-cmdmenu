fx_version 'cerulean'
game 'gta5'
lua54 'yes'

ui_page 'web/dist/index.html'
files {
  'web/dist/**',
  'shared/modules/console.lua'
}

shared_scripts {
  'shared/classes/actions.lua',
  'shared/main.lua'
}

client_scripts {
  'client/classes/nui.lua',
  'client/main.lua'
}

server_scripts {
  'server/classes/players.lua',
  'server/main.lua'
}
