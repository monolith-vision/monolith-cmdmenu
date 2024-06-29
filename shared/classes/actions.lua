local Console = require 'shared.modules.console';

---@overload fun(self: self)
Actions = setmetatable({
  overwriteWarning = 'Overwriting command `%s`',
  executionError = 'Error occured while executing command `%s`'
}, {
  __call = function(self, ...)
    return self.Register(self, ...);
  end
});

---@param name string Has to be unique, else it will overwrite other actions/commands
---@param func fun(source: number, arguments: (number | string | nil)[], rawCommand?: string) `source` will always be 0 on the client
---@param argumentTypes? CommandArgument[]
---@param isCommand? boolean Determines if a command should also be registered
---@param restricted? boolean isCommand has to be `true`. Determines if the registered command should be restricted
---@return NewCommand
function Actions.Register(self, name, func, argumentTypes, isCommand, restricted)
  if not self then
    self = Actions;
  end

  local executionErrorString = self.executionError:format(name);

  if CACHED_ACTIONS[name] then
    Console.Warn(self.overwriteWarning:format(name));
  end

  ---@param source number
  ---@param arguments (number | string | nil)[]
  ---@param rawCommand? string
  local function execute(source, arguments, rawCommand)
    local success, error = pcall(func, source, arguments, rawCommand);

    if not success then
      Console.Error(executionErrorString);
      Console.Error(error);
    end
  end

  ---@class NewCommand
  CACHED_ACTIONS[name] = {
    name = name,
    arguments = argumentTypes,
    execute = execute
  };

  if isCommand then
    RegisterCommand(name, function(source, args, rawCommand)
      execute(source, args, rawCommand);
    end, restricted);
  end

  return CACHED_ACTIONS[name];
end
