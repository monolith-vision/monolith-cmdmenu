Players = {};

local EXECUTION_ERROR <const>, SUGGESTIONS <const> = 'Unable to execute action `%s`', {};
local Console <const>, Input <const>, NUI <const> =
    require 'shared.modules.console', require 'client.modules.input', require 'client.modules.nui';

local blockedCommandsString <const> = table.concat(Config.blockedCommands, '|'):lower();
local blockedCommandsSet = {};

for _, blockedCommand in next, Config.blockedCommands do
  blockedCommandsSet[blockedCommand:lower()] = 0;
end

Input('K', function()
  if not IsControlPressed(0, 36) and not IsPauseMenuActive() and not IsNuiFocused() then
    return;
  end

  ---@param commandName string
  ---@return boolean;
  local function isCommandBlocked(commandName)
    commandName = commandName:lower();

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
    if not isCommandBlocked(command.name) then
      local action = CACHED_ACTIONS[command.name] or SUGGESTIONS[command.name] or {};

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

---@param args? { name: string; help?: string; validate?: boolean; type?: string }[]
---@return NewCommand[]?
local function generateArguments(args)
  if not args then
    return;
  end

  ---@type CommandArgument[]
  local arguments = {};

  for _, arg in next, args do
    arguments[#arguments + 1] = {
      name = arg.name,
      type = arg.type == 'player' and 'playerId' or arg.type --[[@as CommandArgumentTypes]],
      required = arg.validate,
    };
  end

  return arguments;
end

RegisterNetEvent('chat:addSuggestion', function(name, _desc, arguments)
  name = name:sub(2, #name - 1);

  SUGGESTIONS[name] = {
    name = name,
    arity = 0,
    arguments = generateArguments(arguments)
  };
end);

RegisterNetEvent('chat:removeSuggestion', function(name)
  name = name:sub(2, #name - 1);

  if SUGGESTIONS[name] then
    SUGGESTIONS[name] = nil;
  end
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
  resp('OK');

  local action = CACHED_ACTIONS[req.name];

  if not action or action.context == 'client' and not action.execute then
    Console.Debug(('Can\'t find action `%s`. Executing Command'):format(req.name));

    ExecuteCommand(req.raw);
  elseif action.context == 'server' then
    TriggerServerEvent('cmd-menu:ExecuteAction', req.name, req.arguments, req.raw);
  elseif action.context == 'client' then
    action.execute(0, req.arguments, req.raw);
  else
    Console.Error(EXECUTION_ERROR:format(req.name));
  end
end);
