import { getScenarioConfig } from './scenario-registry.js';
import { getDefaultPhysicsModel } from '../physics-models.js';

export function getScenarioMetadata(scenario) {
	const scenarioConfig = getScenarioConfig(scenario);
	if (!scenarioConfig.parameters) {
		throw new Error(`Scenario ${scenario} must define parameters`);
	}
	return {
		parameters: scenarioConfig.parameters,
		physicsModel: scenarioConfig?.physicsModel || getDefaultPhysicsModel(),
		relativisticFactor: scenarioConfig?.relativisticFactor,
		quantumUncertainty: scenarioConfig?.quantumUncertainty,
		tunnelingProbability: scenarioConfig?.tunnelingProbability
	};
}

export function getParameterDefault(scenarioMetadata, paramName) {
	return scenarioMetadata?.parameters?.[paramName]?.default ?? null;
}

