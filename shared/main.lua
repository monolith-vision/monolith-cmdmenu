RESOURCE_NAME = GetCurrentResourceName();
CONTEXT = IsDuplicityVersion() and 'server' or 'client';

local debugMetaData = GetResourceMetadata(RESOURCE_NAME, 'debug_mode', 0);
DEBUG = debugMetaData == true or debugMetaData == 'true' or debugMetaData == 'yes' or debugMetaData == 1 or
    debugMetaData == '1';

---@type table<string, NewCommand>
CACHED_ACTIONS = setmetatable({}, {
  __newindex = function(self, key, value)
    rawset(self, key, value);

    if CONTEXT ~= 'server' then
      return;
    end

    TriggerClientEvent('cmd-menu:AddAction', -1, key, {
      name = value.name,
      arguments = value.arguments,
      context = value.context,
    });
  end
});
