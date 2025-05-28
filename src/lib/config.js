import { Mass } from './physics';
import { physicsConfig } from './physics-config';
import { scenarios } from './scenarios';

export const config = {
    ...physicsConfig,
    scenario: 'N'              // Default scenario
};

export function getScenario(scenario, n = 3) {
    const scenarioConfig = scenarios[scenario];
    if (!scenarioConfig) {
        throw new Error(`Unknown scenario: ${scenario}`);
    }
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

export function initializeMasses(centerX, centerY, orbitRadius, scenario, n = 3) {
    const scenarioConfig = getScenario(scenario, n);
    const masses = [];
    const positions = scenarioConfig.initialPositions(centerX, centerY, orbitRadius)(n);
    
    const baseVelocity = scenarioConfig.getBaseVelocity(orbitRadius);
    const velocities = scenarioConfig.initialVelocities(baseVelocity)(n);

    for (let i = 0; i < scenarioConfig.masses.length; i++) {
        masses.push(new Mass(
            scenarioConfig.masses[i],
            scenarioConfig.radii[i],
            scenarioConfig.colors[i],
            positions[i],
            velocities[i]
        ));
    }

    return masses;
} 