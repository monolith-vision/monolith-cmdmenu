---@alias CommandExecution
---| fun(source: number, arguments: (number | string | nil)[], rawCommand?: string)

---@alias CommandRestriction
---| boolean
---| fun(source: number): boolean

---@alias CommandArgumentTypes 'string' | 'playerId' | 'number'

---@class CommandArgumentChoice
---@field label string
---@field value string | number

---@class CommandArgument
---@field name string
---@field type CommandArgumentTypes
---@field required? boolean
---@field choices? CommandArgumentChoice[]

---@class CommandBase
---@field name string
---@field arity number

---@class Command:CommandBase
---@field arguments? CommandArgument[]

---@class NewCommand
---@field name string
---@field arguments? CommandArgumentChoice[]
---@field execute fun(source: number, arguments: (number | string | nil)[], rawCommand: string)
---@field context 'server' | 'client'
