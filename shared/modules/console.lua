local Console = {};

---@param str string
function Console.Error(str)
  print('^1[ERROR]:^0 ' .. str .. '^0');
end

---@param str string
function Console.Warn(str)
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
  print('^4[INFO]:^0 ' .. str .. '^0');
end

return Console;