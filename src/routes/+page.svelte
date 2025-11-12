<script>
	import { base } from '$app/paths';
</script>

<div class="landing">
	<div class="hero">
		<h1>Newton's N-Body Simulation</h1>
		<p class="subtitle">Explore gravitational interactions in real-time</p>
	</div>
	
	<div class="simulations">
		<a href={`${base}/N`} class="sim-card">
			<div class="card-content">
				<div class="icon">N</div>
				<h2>N-Body Simulation</h2>
				<p>Configure and run custom N-body gravitational simulations with 2 to 1000 bodies. Watch as masses interact through gravitational forces.</p>
			</div>
		</a>

		<a href={`${base}/solar`} class="sim-card">
			<div class="card-content">
				<div class="icon solar">☉</div>
				<h2>Solar System</h2>
				<p>Experience a simplified solar system simulation with a central star and five orbiting bodies, each with unique masses and velocities.</p>
			</div>
		</a>
	</div>
</div>

<style>
	.landing {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);
		color: white;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
		max-width: 800px;
	}

	h1 {
		font-size: 3.5rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #aaa;
		margin: 0;
	}

	.simulations {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		width: 100%;
		max-width: 1200px;
	}

	.sim-card {
		background: #222;
		border-radius: 16px;
		padding: 2rem;
		text-decoration: none;
		color: white;
		transition: all 0.3s ease;
		border: 2px solid transparent;
		display: block;
	}

	.sim-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
		border-color: #667eea;
		background: #2a2a3e;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.icon {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.icon.solar {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		font-size: 2.5rem;
	}

	h2 {
		font-size: 1.75rem;
		margin: 0;
		color: white;
	}

	.card-content p {
		color: #ccc;
		line-height: 1.6;
		margin: 0;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2.5rem;
		}

		.simulations {
			grid-template-columns: 1fr;
		}

		.landing {
			padding: 2rem 1rem;
		}
	}
</style>
