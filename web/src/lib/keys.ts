import { MutableRefObject, useEffect, useRef } from 'react';
import { noop } from './constants';

const useKeyEvent = (
	action: 'keydown' | 'keyup',
	key: string,
	handler: (data: KeyboardEvent) => void,
) => {
	const savedHandler: MutableRefObject<(data: KeyboardEvent) => void> =
		useRef(noop);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const keyListener = (event: KeyboardEvent) => {
			if (event.key === key) savedHandler.current(event);
		};

		window.addEventListener(action, keyListener);

		return () => window.removeEventListener(action, keyListener);
	}, [action, key, savedHandler]);
};

const useKeyDown = (key: string, handler: (data: KeyboardEvent) => void) =>
	useKeyEvent('keydown', key, handler);

const useKeyUp = (key: string, handler: (data: KeyboardEvent) => void) =>
	useKeyEvent('keyup', key, handler);

export { useKeyEvent, useKeyDown, useKeyUp };
