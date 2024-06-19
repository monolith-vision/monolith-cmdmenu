import { create } from 'zustand';

interface PlayerStore {
	players: Player[];
	setStore: StoreSetter<PlayerStore>;
}

const usePlayerStore = create<PlayerStore>((setStore) => ({
	players: [],
	setStore,
}));

export { usePlayerStore };
export default usePlayerStore;
