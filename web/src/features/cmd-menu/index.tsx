import { useNuiEvent } from '@/lib/hooks';
import { useKeyDown } from '@/lib/keys';
import { useEffect, useState } from 'react';

import Results from './components/results';
import useCommandStore from '@/stores/commands';

export default function CommandMenu() {
	const [input, setInput] = useState('');
	const { commands, setCommands } = useCommandStore();
	const [matchingCommand, setMatchingCommand] = useState<
		Command | undefined
	>();

	useEffect(() => {
		if (input.length)
			setMatchingCommand(
				commands.find(
					(c) =>
						c.name
							.toLowerCase()
							.search(input.split(' ')[0].toLowerCase()) > -1,
				),
			);
	}, [input, commands]);

	useNuiEvent<Command[]>('UpdateCommands', (commands) =>
		setCommands({ commands }),
	);

	useKeyDown('Tab', (e) => {
		if (!matchingCommand) return;

		e.preventDefault();

		setInput(matchingCommand?.name);
	});

	return (
		<main className="absolute w-[700px] min-h-24 max-h-[600px] bg-black border rounded-xl">
			<div className="relative w-full h-12 flex items-center border-b">
				<div className="text-white/25 w-full px-4">
					<h1 className="text-base font-medium">
						{input.length === 0
							? 'Enter Command'
							: matchingCommand?.name}
					</h1>
				</div>
				<input
					value={input}
					type="text"
					className="absolute w-full h-12 outline-none text-white px-4 font-medium bg-transparent placeholder:text-white/25"
					onChange={({ currentTarget: { value } }) => setInput(value)}
				/>
			</div>
			<Results />
		</main>
	);
}
