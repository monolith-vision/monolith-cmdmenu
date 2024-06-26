import { create } from 'zustand';

interface CommandStore {
	input: string;
	commands: Command[];
	matchingCommand?: Command;
	focusedArgument?: CommandArgument;
	commandValues: (string | number | null)[];
	setInput: (input: string) => void;
	setCommands: (commands: Command[]) => void;
	setMatchingCommand: (command: Command | undefined) => void;
	setFocusedArgument: (focusedArgument: CommandArgument | undefined) => void;
	setCommandValues: (commandValues: (string | number | null)[]) => void;
	setStore: StoreSetter<CommandStore>;
}

const useCommandStore = create<CommandStore>((set) => ({
	input: '',
	commands: [],
	commandValues: [],
	setInput: (input) => set({ input }),
	setCommands: (commands) => set({ commands }),
	setMatchingCommand: (matchingCommand) => set({ matchingCommand }),
	setFocusedArgument: (focusedArgument) => set({ focusedArgument }),
	setCommandValues: (commandValues) => set({ commandValues }),
	setStore: set,
}));

export { useCommandStore };
export default useCommandStore;
