import { create } from 'zustand';

interface CommandStore {
	commands: Command[];
	setCommands: StoreSetter<CommandStore>;
}

const useCommandStore = create<CommandStore>((setCommands) => ({
	commands: [
		{
			name: 'giveweapon',
			arity: -1,
		},
	],
	setCommands,
}));

export { useCommandStore };
export default useCommandStore;
