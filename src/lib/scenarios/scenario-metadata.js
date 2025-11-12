import { getScenarioConfig } from './scenario-registry.js';

export function getScenarioMetadata(scenario) {
	const scenarioConfig = getScenarioConfig(scenario);
	const requiresN =
		typeof scenarioConfig.masses === 'function' && scenarioConfig.masses.length === 1;
	return {
		requiresN,
		defaultN: 3
	};
}

