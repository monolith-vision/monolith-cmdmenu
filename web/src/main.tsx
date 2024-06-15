import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/fonts.css';
import '@/styles/globals.css';

import { isEnvBrowser } from '@/lib/constants';
import CommandMenu from '@/features/cmd-menu';

if (isEnvBrowser)
	document.body.style.backgroundImage =
		'url(../../public/images/browser.jpg)';

ReactDOM.createRoot(document.body).render(
	<React.StrictMode>
		<CommandMenu />
	</React.StrictMode>,
);
