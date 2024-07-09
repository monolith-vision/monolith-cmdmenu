import { CornerDownLeft } from 'lucide-react';

import useCommandStore from '@/stores/commands';

import { cn } from '@/lib/utils';

export default function Commands({
	selected,
	results,
	setSelected,
}: {
	selected: number;
	results: Command[];
	setSelected: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { input, matchingCommand } = useCommandStore();

	return (
		<>
			{results.map((command, index) => (
				<button
					key={`${command.name}${index}`}
					data-result
					className={cn(
						'relative flex items-center justify-start p-2 rounded-lg z-0 opacity-50 transition-all',
						'before:absolute before:bg-accent/40 before:inset-[99px] before:-z-[1] before:rounded-[inherit] before:duration-300 before:opacity-0',
						'before:border-transparent',
						selected === index &&
							'before:inset-0 before:opacity-100 before:border before:border-border opacity-100',
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
		</>
	);
}
