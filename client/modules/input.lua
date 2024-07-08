---@overload fun(key: string, func: fun(source: 0, args: string[], rawCommand: string))
local Input = setmetatable({
  commands = {}
}, {
  __call = function(self, ...)
    return self.New(self, ...);
  end
});

---@param key string
---@param func fun(source: 0, args: string[], rawCommand: string)
function Input:New(key, func)
  local commandName = RESOURCE_NAME .. '_' .. key;

  RegisterKeyMapping(commandName, key:upper(), 'keyboard', key);

  RegisterCommand(commandName, func, false);
end

return Input;
