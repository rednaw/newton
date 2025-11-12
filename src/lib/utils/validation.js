export function validateN(n, min = 2, max = 1000) {
	if (n === null || n === undefined) {
		return { valid: false, error: 'Number of bodies is required' };
	}
	const num = typeof n === 'number' ? n : parseInt(n);
	if (isNaN(num)) {
		return { valid: false, error: 'Number of bodies must be a valid number' };
	}
	if (num < min) {
		return { valid: false, error: `Number of bodies must be at least ${min}` };
	}
	if (num > max) {
		return { valid: false, error: `Number of bodies must be at most ${max}` };
	}
	return { valid: true, value: num };
}

export function validatePhysicsParams(params) {
	const errors = {};

	if (params.G === undefined || params.G === null) {
		errors.G = 'Gravitational constant is required';
	} else {
		const g = Number(params.G);
		if (isNaN(g) || g < 1 || g > 1000) {
			errors.G = 'Gravitational constant must be between 1 and 1000';
		}
	}

	if (params.DT === undefined || params.DT === null) {
		errors.DT = 'Time step is required';
	} else {
		const dt = Number(params.DT);
		if (isNaN(dt) || dt < 0.01 || dt > 1) {
			errors.DT = 'Time step must be between 0.01 and 1';
		}
	}

	if (params.SOFTENING === undefined || params.SOFTENING === null) {
		errors.SOFTENING = 'Softening parameter is required';
	} else {
		const softening = Number(params.SOFTENING);
		if (isNaN(softening) || softening < 1 || softening > 1000) {
			errors.SOFTENING = 'Softening parameter must be between 1 and 1000';
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
