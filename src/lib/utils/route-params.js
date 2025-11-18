import { validateN } from './validation';
import { getScenarioMetadata, getParameterDefault } from '../scenarios/scenario-metadata.js';

export function parseRouteParams(page, browser, scenarioMetadata = null) {
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
		const defaultN = scenarioMetadata ? getParameterDefault(scenarioMetadata, 'n') : null;
		return {
			scenario,
			n: defaultN,
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
