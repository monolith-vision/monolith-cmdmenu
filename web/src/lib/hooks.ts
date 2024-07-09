import { MutableRefObject, useEffect, useRef } from 'react';
import { noop } from './constants';

export const useNuiEvent = <T = unknown>(
	action: string,
	handler: NuiHandlerSignature<T>,
) => {
	const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const eventListener = (event: MessageEvent): void => {
			const { data } = event;

			if (savedHandler.current && data.action === action)
				savedHandler.current(data.data as T);
		};

		window.addEventListener('message', eventListener);

		return () => window.removeEventListener('message', eventListener);
	}, [action, handler]);
};
