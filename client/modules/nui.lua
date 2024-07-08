---@class NUI
---@field Send fun(self: self, action: string, data: table | string | number | boolean): nil
local NUI;

NUI = setmetatable({}, {
  __index = NUI,
});

---@param action string
---@param data table | string | number | boolean
function NUI:Send(action, data)
  SendNUIMessage({
    action = action,
    data = data,
  });
end

return NUI;
