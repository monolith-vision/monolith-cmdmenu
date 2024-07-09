import { isEnvBrowser } from './constants';

interface CustomWindow extends Window {
	GetParentResourceName?: () => string;
}

export async function fetchNui<T = unknown>(
	event: string,
	data?: unknown,
	mockData?: T,
): Promise<void | T> {
	if (isEnvBrowser) {
		if (mockData) return mockData;
		return;
	}

	const resourceName: string = (window as CustomWindow).GetParentResourceName
		? (window as CustomWindow).GetParentResourceName!()
		: 'nui-resource';

	const resp = await fetch(`https://${resourceName}/${event}`, {
		method: 'POST',
		body: JSON.stringify(data),
	});

	return await resp.json();
}
