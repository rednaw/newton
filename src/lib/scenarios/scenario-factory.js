import { Mass } from '../physics.js';
import { getScenarioConfig } from './scenario-registry.js';

export function getScenario(scenario, n) {
	const scenarioConfig = getScenarioConfig(scenario);
	return {
		...scenarioConfig,
		masses: scenarioConfig.masses(n),
		radii: scenarioConfig.radii(n),
		colors: scenarioConfig.colors(n),
		initialPositions: scenarioConfig.initialPositions,
		initialVelocities: scenarioConfig.initialVelocities,
		getBaseVelocity: scenarioConfig.getBaseVelocity
	};
}

export function initializeMasses(centerX, centerY, orbitRadius, scenario, n, G = 500) {
	if (
		typeof centerX !== 'number' ||
		typeof centerY !== 'number' ||
		typeof orbitRadius !== 'number'
	) {
		throw new Error('Invalid canvas dimensions');
	}
	if (orbitRadius <= 0) {
		throw new Error('Orbit radius must be positive');
	}

	const scenarioConfig = getScenario(scenario, n);
	const masses = [];
	const positions = scenarioConfig.initialPositions(centerX, centerY, orbitRadius)(n);

	if (!Array.isArray(positions) || positions.length !== scenarioConfig.masses.length) {
		throw new Error('Position array length mismatch');
	}

	const baseVelocity = scenarioConfig.getBaseVelocity(orbitRadius, G);
	const velocities = scenarioConfig.initialVelocities(baseVelocity)(n);

	if (!Array.isArray(velocities) || velocities.length !== scenarioConfig.masses.length) {
		throw new Error('Velocity array length mismatch');
	}

	for (let i = 0; i < scenarioConfig.masses.length; i++) {
		if (scenarioConfig.masses[i] <= 0) {
			throw new Error(`Invalid mass at index ${i}: must be positive`);
		}
		masses.push(
			new Mass(
				scenarioConfig.masses[i],
				scenarioConfig.radii[i],
				scenarioConfig.colors[i],
				positions[i],
				velocities[i]
			)
		);
	}

	return masses;
}

