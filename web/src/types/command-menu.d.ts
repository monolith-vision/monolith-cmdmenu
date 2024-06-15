type CommandArgumentTypes = 'string' | 'playerId' | 'number';

interface CommandArgumentChoice {
	label: string;
	value: string | number;
}

interface CommandArgument {
	name: string;
	type: CommandArgumentTypes;
	choices: CommandArgumentChoice[];
}

interface CommandBase {
	name: string;
	arity: number;
}

interface Command extends CommandBase {
	description?: string;
	arguments?: CommandArgument[];
}
