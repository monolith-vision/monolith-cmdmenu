RESOURCE_NAME = GetCurrentResourceName();

local debugMetaData = GetResourceMetadata(RESOURCE_NAME, 'debug', 1);
DEBUG = debugMetaData == true or debugMetaData == 'true' or debugMetaData == 1 or debugMetaData == '1';

---@type table<string, NewCommand>
CACHED_ACTIONS = {};
