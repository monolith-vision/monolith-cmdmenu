local Console = {};
local ALLOWED_LOGS = {};

if not DEBUG then
  for i = 0, GetNumResourceMetadata(RESOURCE_NAME, 'allowed_log') - 1 do
    ALLOWED_LOGS[GetResourceMetadata(RESOURCE_NAME, 'allowed_log', i)] = true;
  end
end

---@param str string
function Console.Error(str)
  if not ALLOWED_LOGS.error then
    return;
  end

  print('^1[ERROR]:^0 ' .. str .. '^0');
end

---@param str string
function Console.Warn(str)
  if not ALLOWED_LOGS.warn then
    return;
  end

  print('^2[WARNING]:^0 ' .. str .. '^0');
end

---@param str string
function Console.Debug(str)
  if not DEBUG then
    return;
  end

  local line = debug.getinfo(2, 'l').currentline;
  local file = debug.getinfo(2, 'S').source:sub(2);

  print('^2[DEBUG]:^0 (' .. file .. ':' .. line .. ')^3 ' .. str .. '^0');
end

---@param str string
function Console.Log(str)
  if not ALLOWED_LOGS.info then
    return;
  end

  print('^4[INFO]:^0 ' .. str .. '^0');
end

return Console;
