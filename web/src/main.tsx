import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/fonts.css';
import '@/styles/globals.css';

import { isEnvBrowser } from '@/lib/constants';
import CommandMenu from '@/features/cmd-menu';
import { Geiger } from 'react-geiger';

if (isEnvBrowser)
	document.body.style.backgroundImage =
		'url(../../public/images/browser.jpg)';

ReactDOM.createRoot(document.getElementById('app')!).render(
	<React.StrictMode>
		<Geiger
			enabled={import.meta.env.MODE === 'development'}
			renderTimeThreshold={5}
		>
			<CommandMenu />
		</Geiger>
	</React.StrictMode>,
);
