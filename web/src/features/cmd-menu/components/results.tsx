import { CornerDownLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

import useCommandStore from '@/stores/commands';
import { useKeyDown } from '@/lib/keys';
import { useEffect, useState } from 'react';

export default function Results() {
	const { input, commands, matchingCommand, setInput } = useCommandStore();
	const [results, setResults] = useState<Command[]>([]);
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		if (!input.length) return setResults([]);

		const lowered = input.split(' ')[0].trim().toLowerCase();

		setResults(
			commands.filter((c) => c.name.toLowerCase().startsWith(lowered)),
		);
	}, [input, commands]);

	useKeyDown('ArrowUp', (e) => {
		e.preventDefault();

		setSelected((prevIndex) => {
			let index = Math.max(-1, prevIndex - 1);

			if (index < 0) index = results.length - 1;

			return index;
		});
	});

	useKeyDown('ArrowDown', (e) => {
		e.preventDefault();

		setSelected((prevIndex) => {
			let index = Math.min(results.length, prevIndex + 1);

			if (index === results.length) index = 0;

			return index;
		});
	});

	useKeyDown('Enter', (e) => {
		e.preventDefault();

		setInput(results[selected].name);
	});

	return (
		<div className="flex flex-col gap-1 overflow-y-scroll p-2">
			{!results.length && (
				<span className="my-2 text-center text-foreground/25">
					No Results
				</span>
			)}
			{results.map((command, index) => (
				<button
					key={command.name}
					className={cn(
						'relative flex items-center justify-start p-2 rounded-lg z-0 opacity-50 transition-opacity',
						'before:absolute before:bg-accent/40 before:inset-[99px] before:-z-[1] before:rounded-[inherit] before:duration-300 before:border before:border-border',
						selected === index && 'before:inset-0 opacity-100',
					)}
					onClick={() => setSelected(index)}
				>
					<span className="text-md text-foreground">
						{command.name}
					</span>
					<div className="ml-2 flex items-center gap-1">
						{command.arguments?.map((argument) => (
							<div
								key={argument.name}
								className="px-1.5 text-sm text-muted-foreground bg-accent rounded-full"
							>
								{argument.name}
							</div>
						))}
					</div>
					<span
						className={cn(
							'flex gap-2 items-center px-1.5 py-1 bg-accent/80 rounded-md text-sm text-foreground translate-x-2 ml-auto opacity-0 transition-all duration-300',
							selected === index &&
								input.split(' ')[0].trim().toLowerCase() !==
									matchingCommand?.name &&
								'opacity-100 translate-x-0',
						)}
					>
						Select
						<CornerDownLeft size={14} />
					</span>
				</button>
			))}
		</div>
	);
}
