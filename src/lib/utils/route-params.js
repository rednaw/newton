import { validateN } from './validation';

export function parseRouteParams(page, browser) {
	if (!browser) {
		return {
			scenario: 'N',
			n: null,
			nError: null
		};
	}

	const scenario = page.params.scenario || 'N';
	const nParam = page.url.searchParams.get('n');
	
	if (nParam === null) {
		return {
			scenario,
			n: null,
			nError: null
		};
	}

	const nValidation = validateN(nParam);
	if (!nValidation.valid) {
		return {
			scenario,
			n: null,
			nError: nValidation.error
		};
	}

	return {
		scenario,
		n: nValidation.value,
		nError: null
	};
}

