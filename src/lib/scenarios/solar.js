const MASSES = [3000, 80, 60, 40, 30, 20];
const RADII = [40, 16, 14, 12, 10, 8];
const COLORS = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'];
const INNER_ORBIT_RADIUS_MULTIPLIER = 0.35;
const OUTER_ORBIT_RADIUS_MULTIPLIER = 0.65;
const MOON1_OFFSET = 35;
const MOON2_OFFSET = 40;
const MOON3_OFFSET = -40;
const INNER_ORBIT_VELOCITY_MULTIPLIER = 0.35;
const OUTER_ORBIT_VELOCITY_MULTIPLIER = 0.25;
const MOON1_VELOCITY_MULTIPLIER = 0.08;
const MOON2_VELOCITY_MULTIPLIER = 0.06;
const MOON3_VELOCITY_MULTIPLIER = 0.06;
const BASE_MASS = 1000;
const VELOCITY_MULTIPLIER = 0.008;

export const solarScenario = {
	requiresN: false,
	masses: () => MASSES,
	radii: () => RADII,
	colors: () => COLORS,
	initialPositions: (centerX, centerY, orbitRadius) => () => [
		{ x: centerX, y: centerY },
		{
			x: centerX + orbitRadius * INNER_ORBIT_RADIUS_MULTIPLIER,
			y: centerY
		},
		{
			x: centerX + orbitRadius * OUTER_ORBIT_RADIUS_MULTIPLIER,
			y: centerY
		},
		{
			x: centerX + orbitRadius * INNER_ORBIT_RADIUS_MULTIPLIER + MOON1_OFFSET,
			y: centerY
		},
		{
			x: centerX + orbitRadius * OUTER_ORBIT_RADIUS_MULTIPLIER + MOON2_OFFSET,
			y: centerY
		},
		{
			x: centerX + orbitRadius * OUTER_ORBIT_RADIUS_MULTIPLIER + MOON3_OFFSET,
			y: centerY
		}
	],
	initialVelocities: (baseVelocity) => () => {
		const v1 = baseVelocity * INNER_ORBIT_VELOCITY_MULTIPLIER;
		const v2 = baseVelocity * OUTER_ORBIT_VELOCITY_MULTIPLIER;
		const vm1 = baseVelocity * MOON1_VELOCITY_MULTIPLIER;
		const vm2 = baseVelocity * MOON2_VELOCITY_MULTIPLIER;
		const vm3 = baseVelocity * MOON3_VELOCITY_MULTIPLIER;

		return [
			{ x: 0, y: 0 },
			{ x: 0, y: v1 },
			{ x: 0, y: v2 },
			{ x: 0, y: v1 + vm1 },
			{ x: 0, y: v2 + vm2 },
			{ x: 0, y: v2 - vm3 }
		];
	},
	getBaseVelocity: (orbitRadius, G) =>
		Math.sqrt((G * BASE_MASS) / orbitRadius) * VELOCITY_MULTIPLIER
};

