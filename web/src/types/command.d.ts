type CommandArgumentTypes = 'string' | 'playerId' | 'number';

interface CommandArgumentChoice {
	label: string;
	value: string | number;
}

interface CommandArgument {
	name: string;
	type: CommandArgumentTypes;
	required?: boolean;
	choices?: CommandArgumentChoice[];
}

interface CommandBase {
	name: string;
	arity: number;
}

interface Command extends CommandBase {
	arguments?: CommandArgument[];
}
