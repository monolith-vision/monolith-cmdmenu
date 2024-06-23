import { create } from 'zustand';

interface PlayerStore {
	players: Player[];
	setPlayers: (players: Player[]) => void;
	setStore: StoreSetter<PlayerStore>;
}

const usePlayerStore = create<PlayerStore>((setStore) => ({
	players: [
		{
			id: 1,
			name: 'ardelan',
		},
		{
			id: 2,
			name: 'Kuuzoo',
		},
		{
			id: 3,
			name: 'Maddox',
		},
		{
			id: 4,
			name: 'Fly',
		},
		{
			id: 5,
			name: 'Only',
		},
	],
	setPlayers: (players) => setStore({ players }),
	setStore,
}));

export { usePlayerStore };
export default usePlayerStore;
