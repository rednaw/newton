import { Mass } from './physics';

export const config = {
    // Physics parameters
    G: 500,                    // Gravitational constant
    DT: 0.1,                   // Time step
    SOFTENING: 100,            // Softening parameter (increased from 50)
    scenario: 'N'              // Default scenario
};

export const scenarios = {
    'N': {
        description: "N equal masses arranged in a circle",
        masses: (n) => Array(n).fill(1000),
        radii: (n) => Array(n).fill(20),
        colors: (n) => Array(n).fill().map((_, i) => 
            `hsl(${(i * 360 / n) % 360}, 70%, 60%)`
        ),
        initialPositions: (centerX, centerY, orbitRadius) => (n) => {
            const positions = [];
            for (let i = 0; i < n; i++) {
                const angle = (i * 2 * Math.PI) / n;
                positions.push({
                    x: centerX + orbitRadius * Math.cos(angle),
                    y: centerY + orbitRadius * Math.sin(angle)
                });
            }
            return positions;
        },
        initialVelocities: (baseVelocity) => (n) => {
            const velocities = [];
            for (let i = 0; i < n; i++) {
                const angle = (i * 2 * Math.PI) / n;
                velocities.push({
                    x: baseVelocity * Math.cos(angle + Math.PI/2),
                    y: baseVelocity * Math.sin(angle + Math.PI/2)
                });
            }
            return velocities;
        },
        getBaseVelocity: (orbitRadius) => Math.sqrt(config.G * 1000 / orbitRadius) * 0.2
    },
    'solar': {
        description: "Solar system with sun, planets, and moons",
        masses: () => [3000, 80, 60, 40, 30, 20],  // Keep the balanced masses
        radii: () => [40, 16, 14, 12, 10, 8],
        colors: () => ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'],
        initialPositions: (centerX, centerY, orbitRadius) => () => [
            // Sun at center
            { x: centerX, y: centerY },
            // Inner planet
            { x: centerX + orbitRadius * 0.35, y: centerY },
            // Outer planet
            { x: centerX + orbitRadius * 0.65, y: centerY },
            // Moon 1
            { x: centerX + orbitRadius * 0.35 + 35, y: centerY },
            // Moon 2
            { x: centerX + orbitRadius * 0.65 + 40, y: centerY },
            // Moon 3
            { x: centerX + orbitRadius * 0.65 - 40, y: centerY }
        ],
        initialVelocities: (baseVelocity) => () => {
            // Keep the same velocity ratios that are working well
            const v1 = baseVelocity * 0.35;  // Inner planet
            const v2 = baseVelocity * 0.25;  // Outer planet
            const vm1 = baseVelocity * 0.08; // Moon 1
            const vm2 = baseVelocity * 0.06; // Moon 2
            const vm3 = baseVelocity * 0.06; // Moon 3

            return [
                // Sun stationary
                { x: 0, y: 0 },
                // Inner planet
                { x: 0, y: v1 },
                // Outer planet
                { x: 0, y: v2 },
                // Moon 1
                { x: 0, y: v1 + vm1 },
                // Moon 2
                { x: 0, y: v2 + vm2 },
                // Moon 3
                { x: 0, y: v2 - vm3 }
            ];
        },
        getBaseVelocity: (orbitRadius) => Math.sqrt(config.G * 1000 / orbitRadius) * 0.008  // Keep the same base velocity
    }
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