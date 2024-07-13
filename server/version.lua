local UPDATE_RESOURCE <const> = '^3A new update is avaible for %s. %s';
local BASE_URL <const> = 'https://api.github.com/repos/monolith-vision/%s/releases/latest';
local RESOURCE_NAME <const> = GetCurrentResourceName();
local RELEASE_URL <const> = BASE_URL:format(RESOURCE_NAME);
local CURRENT_VERSION <const> = GetResourceMetadata(RESOURCE_NAME, 'version', 0);

if not CURRENT_VERSION then
  return print('^1Could not find the version for ' .. RESOURCE_NAME .. '!^0');
end

---@param str string
---@return number[]
local function getVersionNumbers(str)
  return { string.strsplit('.', str:match('%d+%.%d+%.%d+')) };
end

PerformHttpRequest(RELEASE_URL, function(status, body)
  if status ~= 200 or not body then
    return print('^1An error occured, while checking the version. You can ignore this error message.^0');
  end

  local release = json.decode(body);

  if release.prelease then
    print('^3This is a prelease, expect errors to occur.^0');
  end

  local LATEST_VERSION <const> = release.tag_name;
  local LATEST_VERSION_NUMBERS <const> = getVersionNumbers(LATEST_VERSION);
  local CURRENT_VERSION_NUMBERS <const> = getVersionNumbers(CURRENT_VERSION);

  for index, current in next, CURRENT_VERSION_NUMBERS do
    local currentVersionNumber = tonumber(current);
    local latestVersionNumber = tonumber(LATEST_VERSION_NUMBERS[index]);

    if currentVersionNumber > latestVersionNumber then
      return;
    end

    if currentVersionNumber < latestVersionNumber then
      return print(UPDATE_RESOURCE:format(RESOURCE_NAME, release.html_url));
    end
  end
end);
