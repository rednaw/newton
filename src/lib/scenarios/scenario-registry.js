import { nBodyScenario } from './n-body.js';
import { solarScenario } from './solar.js';
import { einsteinScenario } from './einstein.js';
import { quantumScenario } from './quantum.js';

const scenarios = {
	N: nBodyScenario,
	solar: solarScenario,
	E: einsteinScenario,
	Q: quantumScenario
};

export function getScenarioConfig(scenario) {
	const scenarioConfig = scenarios[scenario];
	if (!scenarioConfig) {
		throw new Error(`Unknown scenario: ${scenario}`);
	}
	return scenarioConfig;
}

