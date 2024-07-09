local Console = require 'shared.modules.console';

---@overload fun(self: self): table<number, Player>
---@class Players
local Players = setmetatable({
  ---@type table<number, Player>
  cached = {}
}, {
  __call = function(self)
    return self.cached;
  end
});

---@param source string | number
function Players:Add(source)
  local id = tonumber(source);

  if not id then
    return Console.Error(('Unable to add player source: %s'):format(source));
  end

  self.cached[id] = {
    name = GetPlayerName('' .. source),
    id = id,
  };

  local actions = {};

  for key, action in next, actions do
    actions[key] = {
      name = action.name,
      arguments = action.arguments,
      context = action.context,
    };
  end

  TriggerClientEvent('cmd-menu:AddActions', id, actions);
  TriggerClientEvent('cmd-menu:UpdateServerCommands', id, GetRegisteredCommands());
  TriggerClientEvent('cmd-menu:UpdatePlayers', -1, self.cached);
end

---@param source string | number
function Players:Remove(source)
  local id = tonumber(source);

  if not id then
    return Console.Error(('Unable to remove player source: %s'):format(source));
  end

  self.cached[id] = nil;

  TriggerClientEvent('cmd-menu:UpdatePlayers', -1, self.cached);
end

return Players;
