import { PHYSICS_MODELS } from '../physics-models.js';

const MASS = 1000;
const RADIUS = 20;
const COLOR_SATURATION = 70;
const COLOR_LIGHTNESS = 60;
const VELOCITY_MULTIPLIER = 0.25;
const RELATIVISTIC_FACTOR = 0.0002;

export const einsteinScenario = {
	requiresN: true,
	masses: (n) => Array(n).fill(MASS),
	radii: (n) => Array(n).fill(RADIUS),
	colors: (n) =>
		Array(n)
			.fill()
			.map(
				(_, i) =>
					`hsl(${((i * 360) / n) % 360}, ${COLOR_SATURATION}%, ${COLOR_LIGHTNESS}%)`
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
				x: baseVelocity * Math.cos(angle + Math.PI / 2),
				y: baseVelocity * Math.sin(angle + Math.PI / 2)
			});
		}
		return velocities;
	},
	getBaseVelocity: (orbitRadius, G) =>
		Math.sqrt((G * MASS) / orbitRadius) * VELOCITY_MULTIPLIER,
	physicsModel: PHYSICS_MODELS.relativistic,
	relativisticFactor: RELATIVISTIC_FACTOR
};

