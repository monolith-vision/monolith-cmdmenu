Players = {};

local EXECUTION_ERROR <const> = 'Unable to execute action `%s`';
local Console <const> = require 'shared.modules.console';
local Input <const> = require 'client.modules.input';
local NUI <const> = require 'client.modules.nui';

local blockedCommandsString <const> = table.concat(Config.blockedCommands, '|');
local blockedCommandsSet = {};

for _, blockedCommand in next, Config.blockedCommands do
  blockedCommandsSet[blockedCommand] = 0;
end

Input('K', function()
  if not IsControlPressed(0, 36) and not IsPauseMenuActive() and not IsNuiFocused() then
    return;
  end

  ---@param commandName string
  ---@return boolean;
  local function isCommandBlocked(commandName)
    if blockedCommandsString:find(commandName) then
      return true;
    end

    for blockedCommand in next, blockedCommandsSet do
      if commandName:find(blockedCommand) then
        return true;
      end
    end

    return false;
  end

  ---@type Command[]
  local commands = {};

  for _, command in next, GetRegisteredCommands() do
    if not isCommandBlocked(command) then
      local action = CACHED_ACTIONS[command.name] or {};

      commands[#commands + 1] = {
        name = command.name,
        arity = command.name,
        arguments = action?.arguments
      };
    end
  end

  NUI:Send('UpdateCommands', commands);
  NUI:Send('ToggleMenu', true);
end);

AddStateBagChangeHandler('players', '', function(_, _, value)
  Players = value;

  NUI:Send('UpdatePlayers', value);
end);

RegisterNetEvent('cmd-menu:AddAction', function(key, action)
  CACHED_ACTIONS[key] = action;
end);

RegisterNetEvent('cmd-menu:AddActions', function(actions)
  for key, action in next, actions do
    CACHED_ACTIONS[key] = action;
  end
end);

RegisterNUICallback('NuiFocus', function(req, resp)
  SetNuiFocus(req.display, req.display);

  resp('OK');
end);

RegisterNUICallback('Submit', function(req, resp)
  local action = CACHED_ACTIONS[req.name];

  if not action then
    Console.Debug(('Can\'t find action `%s`. Executing Command'):format(req.name));

    return ExecuteCommand(req.raw);
  end

  if action.context == 'server' then
    TriggerServerEvent('cmd-menu:ExecuteAction', req.name, req.arguments, req.raw);
  elseif action.context == 'client' and action.execute then
    action.execute(0, req.arguments, req.raw);
  else
    Console.Error(EXECUTION_ERROR:format(req.name));
  end

  resp('OK');
end);
