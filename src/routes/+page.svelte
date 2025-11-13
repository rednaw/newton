<script>
	import { base } from '$app/paths';
</script>

<div class="landing">
	<h1>Simulations</h1>
	<ul class="simulations">
		<li>
			<a href={`${base}/N`}>N-Body</a>
		</li>
		<li>
			<a href={`${base}/solar`}>Solar System</a>
		</li>
		<li>
			<a href={`${base}/E`}>Einstein</a>
		</li>
		<li>
			<a href={`${base}/Q`}>Quantum</a>
		</li>
	</ul>
</div>

<style>
	.landing {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);
		color: white;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 3rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.simulations {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 200px;
	}

	.simulations li {
		margin: 0;
	}

	.simulations a {
		display: block;
		padding: 1rem 2rem;
		text-decoration: none;
		color: white;
		background: #222;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: 2px solid transparent;
		text-align: center;
		font-size: 1.25rem;
	}

	.simulations a:hover {
		background: #2a2a3e;
		border-color: #667eea;
		transform: translateX(4px);
	}
</style>
