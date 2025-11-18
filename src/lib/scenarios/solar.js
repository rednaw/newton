const MASSES = [3000, 80, 60, 40, 30, 20];
const RADII = [40, 16, 14, 12, 10, 8];
const COLORS = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'];
const INNER_ORBIT_RADIUS_MULTIPLIER = 0.35;
const OUTER_ORBIT_RADIUS_MULTIPLIER = 0.65;
const PLANET1_OFFSET = 35;
const PLANET2_OFFSET = 40;
const PLANET3_OFFSET = -40;
const INNER_ORBIT_VELOCITY_MULTIPLIER = 0.35;
const OUTER_ORBIT_VELOCITY_MULTIPLIER = 0.25;
const PLANET1_VELOCITY_MULTIPLIER = 0.08;
const PLANET2_VELOCITY_MULTIPLIER = 0.06;
const PLANET3_VELOCITY_MULTIPLIER = 0.06;
const BASE_MASS = 1000;
const VELOCITY_MULTIPLIER = 0.008;

export const solarScenario = {
	parameters: {
		n: { default: 6, min: 6, max: 6 }
	},
	masses: (n) => MASSES,
	radii: (n) => RADII,
	colors: (n) => COLORS,
	initialPositions: (centerX, centerY, orbitRadius) => (n) => [
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
			x: centerX + orbitRadius * INNER_ORBIT_RADIUS_MULTIPLIER + PLANET1_OFFSET,
			y: centerY
		},
		{
			x: centerX + orbitRadius * OUTER_ORBIT_RADIUS_MULTIPLIER + PLANET2_OFFSET,
			y: centerY
		},
		{
			x: centerX + orbitRadius * OUTER_ORBIT_RADIUS_MULTIPLIER + PLANET3_OFFSET,
			y: centerY
		}
	],
	initialVelocities: (baseVelocity) => (n) => {
		const v1 = baseVelocity * INNER_ORBIT_VELOCITY_MULTIPLIER;
		const v2 = baseVelocity * OUTER_ORBIT_VELOCITY_MULTIPLIER;
		const vm1 = baseVelocity * PLANET1_VELOCITY_MULTIPLIER;
		const vm2 = baseVelocity * PLANET2_VELOCITY_MULTIPLIER;
		const vm3 = baseVelocity * PLANET3_VELOCITY_MULTIPLIER;

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

