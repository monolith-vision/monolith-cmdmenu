import { useKeyDown } from '@/lib/keys';
import { useEffect, useState } from 'react';
import usePlayerStore from '@/stores/players';
import useCommandStore from '@/stores/commands';
import Players from './results-players';
import Commands from './results-commands';
import Choices from './results-choices';

export default function Results() {
	const {
		input,
		commands,
		focusedArgument,
		matchingCommand,
		commandValues,
		setInput,
		setCommandValues,
	} = useCommandStore();
	const { players } = usePlayerStore();
	const [results, setResults] = useState<Command[]>([]);
	const [selected, setSelected] = useState(0);
	const [context, setContext] = useState<'choice' | 'player' | 'command'>(
		'command',
	);
	const contextArray =
		context === 'command'
			? results
			: context === 'player'
			? players
			: (focusedArgument?.choices as CommandArgumentChoice[]);

	useEffect(() => {
		setSelected(0);
	}, [context]);

	useEffect(() => {
		if (!input.length) return setResults([]);

		const lowered = input.split(' ')[0].trim().toLowerCase();

		setResults(
			commands.filter((c) => c.name.toLowerCase().search(lowered) > -1),
		);
	}, [input, commands]);

	useEffect(() => {
		if (focusedArgument) {
			if (focusedArgument.choices?.length) return setContext('choice');

			if (focusedArgument.type === 'playerId')
				return setContext('player');
		}

		setContext('command');
	}, [focusedArgument]);

	useKeyDown('ArrowUp', (e) => {
		e.preventDefault();

		setSelected((prevIndex) => {
			let index = Math.max(-1, prevIndex - 1);

			if (index < 0) index = contextArray.length - 1;

			document
				.querySelectorAll('[data-result]')
				.item(index)
				?.scrollIntoView({
					block: 'center',
					inline: 'nearest',
					behavior: 'smooth',
				});

			return index;
		});
	});

	useKeyDown('ArrowDown', (e) => {
		e.preventDefault();

		setSelected((prevIndex) => {
			let index = Math.min(contextArray.length, prevIndex + 1);

			if (index === contextArray.length) index = 0;

			document
				.querySelectorAll('[data-result]')
				.item(index)
				?.scrollIntoView({
					block: 'center',
					inline: 'nearest',
					behavior: 'smooth',
				});

			return index;
		});
	});

	const select = (e: KeyboardEvent) => {
		e.preventDefault();

		switch (context) {
			case 'choice':
			case 'player': {
				if (
					!matchingCommand ||
					!matchingCommand.arguments ||
					!(document.activeElement as HTMLElement).dataset.argument
				)
					return;

				const index = matchingCommand.arguments.findIndex(
					(a) => a.name === focusedArgument?.name,
				);

				if (index < 0) return;

				const value = contextArray[selected];

				commandValues[index] =
					'value' in value
						? value.value
						: 'id' in value
						? value.id
						: null;

				setCommandValues([...commandValues]);
				break;
			}
			case 'command':
				if (
					results.length &&
					selected > -1 &&
					results[selected] !== undefined &&
					input !== results[selected].name
				)
					setInput(results[selected].name);
				break;
		}
	};

	useKeyDown('Enter', select);
	useKeyDown('Tab', select);

	return (
		<div className="relative flex flex-col gap-1 max-h-[292px] overflow-y-scroll p-2">
			{!results.length && (
				<span className="my-2 text-center text-foreground/25">
					No Results
				</span>
			)}
			{context === 'command' && (
				<Commands
					results={results}
					selected={selected}
					setSelected={setSelected}
				/>
			)}
			{context === 'player' && (
				<Players
					players={players}
					selected={selected}
					setSelected={setSelected}
				/>
			)}
			{context === 'choice' &&
				focusedArgument !== undefined &&
				focusedArgument.choices !== undefined && (
					<Choices
						choices={focusedArgument.choices}
						selected={selected}
						setSelected={setSelected}
					/>
				)}
		</div>
	);
}
