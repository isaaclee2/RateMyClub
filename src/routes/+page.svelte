<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Get user session
	const user = $derived(data.session?.user);

	function goToAllClubs() {
		goto('/all-clubs');
	}
</script>

<div class="container-1">
	<div class="cover">
		<img class="image" src="/img4.jpg" alt="USC Campus" />
		<div class="overlay"></div>
	</div>

	<div class="content">
		<h1 class="description">Rate and review clubs at USC</h1>

		<button class="search-link" on:click={goToAllClubs}>
			<span class="search-text">Search for your club</span>
			<svg
				class="arrow-icon"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</button>

		<div class="all-clubs">
			<a href="/all-clubs">Browse all clubs</a>
		</div>
	</div>
</div>

<style>
	.container-1 {
		position: relative;
		width: 100%;
		height: 450px;
	}

	.image {
		width: 100%;
		height: 450px;
		object-fit: cover;
		display: block;
	}

	.cover {
		position: relative;
		width: 100%;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		pointer-events: none;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		padding: 20px;
		box-sizing: border-box;
	}

	.description {
		color: white;
		font-size: clamp(20px, 4vw, 27px);
		font-weight: 900;
		font-family: 'Mulish', sans-serif;
		text-align: center;
		margin: 0 0 30px 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	.search-link {
		display: flex;
		width: fit-content;
		min-width: 320px;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: white;
		color: #333;
		padding: 20px 35px;
		border: none;
		border-radius: 12px;
		font-size: 20px;
		font-weight: 600;
		font-family: 'Mulish', sans-serif;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		margin-bottom: 20px;
		text-decoration: none;
		white-space: nowrap;
	}

	.search-link:hover {
		background: #f8f9fa;
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
	}

	.search-link:hover .arrow-icon {
		transform: translateX(5px);
	}

	.search-text {
		font-size: 20px;
		white-space: nowrap;
	}

	.arrow-icon {
		transition: transform 0.3s ease;
		flex-shrink: 0;
		width: 28px;
		height: 28px;
	}

	.all-clubs {
		text-align: center;
	}

	.all-clubs a {
		color: white;
		text-decoration: underline;
		font-family: 'Mulish', sans-serif;
		font-weight: bold;
		font-size: 17px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
		transition: color 0.3s ease;
	}

	.all-clubs a:hover {
		color: #87ceeb;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.container-1 {
			height: 350px;
		}
		.image {
			height: 350px;
		}

		.description {
			font-size: 22px;
			margin-bottom: 30px;
		}

		.search-link {
			min-width: 220px;
			padding: 14px 24px;
			font-size: 17px;
			gap: 12px;
			border-radius: 10px;
		}

		.search-text {
			font-size: 17px;
		}

		.arrow-icon {
			width: 22px;
			height: 22px;
		}

		.all-clubs a {
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		.container-1 {
			height: 300px;
		}
		.image {
			height: 300px;
		}

		.description {
			font-size: 18px;
			margin-bottom: 20px;
		}

		.search-link {
			min-width: 180px;
			padding: 12px 20px;
			font-size: 15px;
			gap: 8px;
		}

		.search-text {
			font-size: 15px;
		}

		.arrow-icon {
			width: 18px;
			height: 18px;
		}

		.content {
			padding: 15px;
		}
	}
</style>
