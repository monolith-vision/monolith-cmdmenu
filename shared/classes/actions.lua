local Console = require 'shared.modules.console';

---@overload fun(name: string, func: CommandExecution, argumentTypes?: CommandArgument[], isCommand?: boolean, restricted?: CommandRestriction): NewCommand
Actions = setmetatable({
  overwriteWarning = 'Overwriting command `%s`',
  executionError = 'Error occured while executing command `%s`',
  requiredError = 'A non-required argument can\'t be followed by a required argument'
}, {
  __call = function(self, ...)
    return self.Register(self, ...);
  end
});

---@param name string Has to be unique, else it will overwrite other actions/commands
---@param func fun(source: number, arguments: (number | string | nil)[], rawCommand?: string) `source` will always be 0 on the client
---@param argumentTypes? CommandArgument[]
---@param isCommand? boolean Determines if a command should also be registered
---@param restricted? boolean | fun(source: number): boolean Determines if the registered command should be restricted
---@return NewCommand
function Actions:Register(name, func, argumentTypes, isCommand, restricted)
  if not self then
    self = Actions;
  end

  local executionErrorString = self.executionError:format(name);

  if CACHED_ACTIONS[name] then
    Console.Warn(self.overwriteWarning:format(name));
  end

  if argumentTypes then
    for index, argument in next, argumentTypes do
      if index > 1 and not argumentTypes[index - 1]?.required and argument.required then
        error(self.requiredError);
      end
    end
  end

  ---@param source number
  ---@param arguments (number | string | nil)[]
  ---@param rawCommand? string
  local function execute(source, arguments, rawCommand)
    if restricted == nil then
      goto continue
    end

    if restricted == true and CONTEXT == 'server' then
      if not IsPlayerAceAllowed('' .. source, 'command.' .. name) then
        return;
      end
    elseif
        type(restricted) == 'function' and
        not restricted(CONTEXT == 'server' and source or GetPlayerServerId(PlayerId()))
    then
      return;
    end

    ::continue::

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
    execute = execute,
    context = CONTEXT
  };

  if isCommand then
    RegisterCommand(name, execute, type(restricted) == 'function' or restricted == true);
  end

  return CACHED_ACTIONS[name];
end

local function RegisterAction(name, func, argumentTypes, isCommand, restricted)
  return Actions:Register(name, func, argumentTypes, isCommand, restricted);
end

local function AddArguments(name, argumentTypes)
  CACHED_ACTIONS[name] = {
    name = name,
    context = CONTEXT,
    argumentTypes = argumentTypes,
  };
end

exports('RegisterAction', RegisterAction);
exports('AddArguments', AddArguments);

AddEventHandler('cmd-menu:RegisterAction', RegisterAction);
AddEventHandler('cmd-menu:AddArguments', AddArguments);
