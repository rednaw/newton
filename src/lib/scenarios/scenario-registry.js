import { nBodyScenario } from './n-body.js';
import { solarScenario } from './solar.js';

const scenarios = {
	N: nBodyScenario,
	solar: solarScenario
};

export function getScenarioConfig(scenario) {
	const scenarioConfig = scenarios[scenario];
	if (!scenarioConfig) {
		throw new Error(`Unknown scenario: ${scenario}`);
	}
	return scenarioConfig;
}

export function getAllScenarios() {
	return Object.keys(scenarios);
}

