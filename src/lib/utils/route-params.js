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

	const parsed = parseInt(nParam, 10);
	if (isNaN(parsed)) {
		return {
			scenario,
			n: null,
			nError: `Invalid number format: "${nParam}"`
		};
	}

	return {
		scenario,
		n: parsed,
		nError: null
	};
}

