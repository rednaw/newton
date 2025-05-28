import { physicsConfig } from './physics-config';

export const scenarios = {
    'N': {
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
        getBaseVelocity: (orbitRadius) => Math.sqrt(physicsConfig.G * 1000 / orbitRadius) * 0.2
    },
    'solar': {
        masses: () => [3000, 80, 60, 40, 30, 20],
        radii: () => [40, 16, 14, 12, 10, 8],
        colors: () => ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'],
        initialPositions: (centerX, centerY, orbitRadius) => () => [
            { x: centerX, y: centerY },
            { x: centerX + orbitRadius * 0.35, y: centerY },
            { x: centerX + orbitRadius * 0.65, y: centerY },
            { x: centerX + orbitRadius * 0.35 + 35, y: centerY },
            { x: centerX + orbitRadius * 0.65 + 40, y: centerY },
            { x: centerX + orbitRadius * 0.65 - 40, y: centerY }
        ],
        initialVelocities: (baseVelocity) => () => {
            const v1 = baseVelocity * 0.35;
            const v2 = baseVelocity * 0.25;
            const vm1 = baseVelocity * 0.08;
            const vm2 = baseVelocity * 0.06;
            const vm3 = baseVelocity * 0.06;

            return [
                { x: 0, y: 0 },
                { x: 0, y: v1 },
                { x: 0, y: v2 },
                { x: 0, y: v1 + vm1 },
                { x: 0, y: v2 + vm2 },
                { x: 0, y: v2 - vm3 }
            ];
        },
        getBaseVelocity: (orbitRadius) => Math.sqrt(physicsConfig.G * 1000 / orbitRadius) * 0.008
    }
}; 