local Console = require 'shared.modules.console';

GlobalState:set('players', {}, true);

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

  GlobalState:set('players', self.cached, true);

  local actions = {};

  for key, action in next, actions do
    actions[key] = {
      name = action.name,
      arguments = action.arguments,
      context = action.context,
    };
  end

  TriggerClientEvent('cmd-menu:AddActions', id, actions);
end

---@param source string | number
function Players:Remove(source)
  local id = tonumber(source);

  if not id then
    return Console.Error(('Unable to remove player source: %s'):format(source));
  end

  self.cached[id] = nil;

  GlobalState:set('players', self.cached, true);
end

return Players;