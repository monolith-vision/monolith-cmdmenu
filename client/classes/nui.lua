---@class NUI
---@field Send fun(action: string, data: table | string | number | boolean): nil
NUI = setmetatable({}, {
  __index = NUI,
});

---@param action string
---@param data table | string | number | boolean
---@return nil
function NUI:Send(action, data)
  SendNUIMessage({
    action = action,
    data = data,
  });
end
