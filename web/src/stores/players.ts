import { create } from 'zustand';

interface PlayerStore {
	players: Player[];
	setPlayers: (players: Player[]) => void;
	setStore: StoreSetter<PlayerStore>;
}

const usePlayerStore = create<PlayerStore>((setStore) => ({
	players: [],
	setPlayers: (players) => setStore({ players }),
	setStore,
}));

export { usePlayerStore };
export default usePlayerStore;
