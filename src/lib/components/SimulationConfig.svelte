<script>
	import { onMount } from 'svelte';
	import { physicsConfig } from '$lib/stores/physics-config';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { validatePhysicsParams, validateN } from '$lib/utils/validation';
	import { getParameterDefault, getScenarioMetadata } from '$lib/scenarios/scenario-metadata.js';
	import { getAllScenarios, getScenarioName } from '$lib/scenarios/scenario-registry.js';

	export let scenario;
	export let scenarioMetadata;
	export let n = null;

	const availableScenarios = getAllScenarios();
	let selectedScenario = scenario;

	let sidebarOpen = false;
	let physicsParams = { G: 500, DT: 0.1, SOFTENING: 100 };
	let validationErrors = {};
	let nBodies = null;

	onMount(() => {
		physicsParams = { ...$physicsConfig };
	});

	$: if (scenarioMetadata) {
		nBodies = n ?? getParameterDefault(scenarioMetadata, 'n');
	}

	$: selectedScenario = scenario;

	function clearValidationErrors() {
		validationErrors = {};
	}

	function buildScenarioUrl(scenarioName, nValue) {
		return `${base}/${scenarioName}${nValue ? `?n=${nValue}` : ''}`;
	}

	function convertPhysicsParams() {
		return {
			G: Number(physicsParams.G),
			DT: Number(physicsParams.DT),
			SOFTENING: Number(physicsParams.SOFTENING)
		};
	}

	function updatePhysicsParams() {
		clearValidationErrors();
		const physicsValidation = validatePhysicsParams(physicsParams);
		if (!physicsValidation.valid) {
			validationErrors = physicsValidation.errors;
			return;
		}

		physicsConfig.set(convertPhysicsParams());
	}

	function updateN() {
		if (!scenarioMetadata?.parameters?.n) return;

		clearValidationErrors();
		const paramSchema = scenarioMetadata.parameters.n;
		const nValidation = validateN(nBodies, paramSchema.min, paramSchema.max);
		if (!nValidation.valid) {
			validationErrors.nBodies = nValidation.error;
			return;
		}

		goto(buildScenarioUrl(scenario, nValidation.value), { replaceState: true });
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	async function switchScenario() {
		if (selectedScenario === scenario) return;
		
		try {
			const newMetadata = getScenarioMetadata(selectedScenario);
			const defaultN = getParameterDefault(newMetadata, 'n');
			await goto(buildScenarioUrl(selectedScenario, defaultN));
		} catch (e) {
			clearValidationErrors();
			validationErrors.scenario = 'Invalid scenario';
			selectedScenario = scenario;
		}
	}
</script>

<button class="config-toggle" on:click={toggleSidebar} aria-label="Toggle configuration">
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>

<div class="sidebar" class:open={sidebarOpen}>
	<div class="sidebar-content">
		<h2>Configuration</h2>

		<div class="config-section">
			<h3>Scenario</h3>
			<div class="param-group">
				<label>
					Simulation Type:
					<select bind:value={selectedScenario} on:change={switchScenario} class="scenario-select">
						{#each availableScenarios as s}
							<option value={s}>{getScenarioName(s)}</option>
						{/each}
					</select>
					{#if validationErrors.scenario}
						<span class="error-text">{validationErrors.scenario}</span>
					{/if}
				</label>
			</div>
		</div>

		<div class="config-section">
			<h3>Physics Parameters</h3>
			<div class="param-group">
				<label>
					Gravitational Constant (G):
					<input
						type="number"
						bind:value={physicsParams.G}
						min="1"
						max="1000"
						step="10"
						class:error={validationErrors.G}
						on:input={updatePhysicsParams}
					/>
					{#if validationErrors.G}
						<span class="error-text">{validationErrors.G}</span>
					{/if}
				</label>
			</div>
			<div class="param-group">
				<label>
					Time Step (DT):
					<input
						type="number"
						bind:value={physicsParams.DT}
						min="0.01"
						max="1"
						step="0.01"
						class:error={validationErrors.DT}
						on:input={updatePhysicsParams}
					/>
					{#if validationErrors.DT}
						<span class="error-text">{validationErrors.DT}</span>
					{/if}
				</label>
			</div>
			<div class="param-group">
				<label>
					Softening Parameter:
					<input
						type="number"
						bind:value={physicsParams.SOFTENING}
						min="1"
						max="1000"
						step="10"
						class:error={validationErrors.SOFTENING}
						on:input={updatePhysicsParams}
					/>
					{#if validationErrors.SOFTENING}
						<span class="error-text">{validationErrors.SOFTENING}</span>
					{/if}
				</label>
			</div>
		</div>

		{#if scenarioMetadata?.parameters?.n}
			<div class="config-section">
				<h3>Simulation Configuration</h3>
				<div class="param-group">
					<label>
						Number of Bodies (N):
						<input
							type="number"
							bind:value={nBodies}
							min={scenarioMetadata.parameters.n.min}
							max={scenarioMetadata.parameters.n.max}
							step="1"
							class:error={validationErrors.nBodies}
							on:blur={updateN}
						/>
						{#if validationErrors.nBodies}
							<span class="error-text">{validationErrors.nBodies}</span>
						{/if}
					</label>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.config-toggle {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(0, 0, 0, 0.6);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
		padding: 0;
		margin: 0;
	}

	.config-toggle:hover {
		background: rgba(0, 0, 0, 0.8);
		border-color: rgba(255, 255, 255, 0.5);
		transform: scale(1.1);
	}

	.config-toggle:active {
		transform: scale(0.95);
	}

	.sidebar {
		position: fixed;
		top: 0;
		right: 0;
		width: 320px;
		height: 100vh;
		background: rgba(17, 17, 17, 0.95);
		backdrop-filter: blur(20px);
		border-left: 1px solid rgba(255, 255, 255, 0.1);
		transform: translateX(100%);
		transition: transform 0.3s ease;
		z-index: 1000;
		overflow-y: auto;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar-content {
		padding: 2rem;
		color: white;
	}

	.sidebar-content h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		margin-top: 4rem;
	}

	.sidebar-content h3 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: #aaa;
	}

	.config-section {
		margin-bottom: 2rem;
	}

	.param-group {
		margin-bottom: 1rem;
	}

	.param-group label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.param-group input[type='number'] {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		width: 100%;
		font-size: 1rem;
	}

	.param-group input[type='number']:focus {
		outline: none;
		border-color: #667eea;
		background: rgba(255, 255, 255, 0.15);
	}

	.param-group input[type='number'].error {
		border-color: #ff4444;
		background: rgba(255, 68, 68, 0.1);
	}

	.scenario-select {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		width: 100%;
		font-size: 1rem;
		cursor: pointer;
	}

	.scenario-select:focus {
		outline: none;
		border-color: #667eea;
		background: rgba(255, 255, 255, 0.15);
	}

	.scenario-select option {
		background: #222;
		color: white;
	}

	.error-text {
		color: #ff4444;
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
		}
	}
</style>

