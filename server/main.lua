local Players <const> = require 'server.modules.players';
local Console <const> = require 'shared.modules.console';
local EXECUTION_ERROR <const> = 'Unable to execute action `%s`. Triggered by: %s';

local function onResourceUpdate()
  TriggerClientEvent('cmd-menu:UpdateServerCommands', -1, GetRegisteredCommands());
end

AddEventHandler('onResourceStop', onResourceUpdate);
AddEventHandler('onResourceStart', onResourceUpdate);

AddEventHandler('playerJoining', function()
  local source = source;

  Players:Add(source);
end);

AddEventHandler('playerDropped', function()
  local source = source;

  Players:Remove(source);
end);

RegisterNetEvent('cmd-menu:ExecuteAction', function(name, arguments, rawCommand)
  local source = source;
  local action = CACHED_ACTIONS[name];

  if not action.execute then
    return Console.Error(EXECUTION_ERROR:format(name, source));
  end

  action.execute(source, arguments, rawCommand);
end);

Citizen.SetTimeout(1000, function()
  for _, player in next, GetPlayers() do
    Players:Add(player);
  end
end);
