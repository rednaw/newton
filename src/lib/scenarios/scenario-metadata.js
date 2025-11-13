import { getScenarioConfig } from './scenario-registry.js';
import { getDefaultPhysicsModel } from '../physics-models.js';

export const DEFAULT_N = 3;

export function getScenarioMetadata(scenario) {
	const scenarioConfig = getScenarioConfig(scenario);
	if (typeof scenarioConfig.requiresN !== 'boolean') {
		throw new Error(`Scenario ${scenario} must define requiresN as a boolean`);
	}
	return {
		requiresN: scenarioConfig.requiresN,
		physicsModel: scenarioConfig?.physicsModel || getDefaultPhysicsModel(),
		relativisticFactor: scenarioConfig?.relativisticFactor,
		quantumUncertainty: scenarioConfig?.quantumUncertainty,
		tunnelingProbability: scenarioConfig?.tunnelingProbability
	};
}

