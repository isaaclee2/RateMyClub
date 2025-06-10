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

<!-- How It Works Section -->
<div class="how-it-works">
	<div class="how-it-works-container">
		<div class="steps">
			<div class="step">
				<div class="step-icon">
					<svg
						viewBox="0 0 24 24"
						width="32"
						height="32"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="M21 21l-4.35-4.35" />
					</svg>
				</div>
				<h3 class="step-title">Search</h3>
				<p class="step-description">Find your club from hundreds of USC organizations</p>
			</div>

			<div class="step">
				<div class="step-icon">
					<svg
						viewBox="0 0 24 24"
						width="32"
						height="32"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
						/>
					</svg>
				</div>
				<h3 class="step-title">Read</h3>
				<p class="step-description">Check honest reviews and ratings from fellow students</p>
			</div>

			<div class="step">
				<div class="step-icon">
					<svg
						viewBox="0 0 24 24"
						width="32"
						height="32"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
						<path d="M13.5 6.5l4 4" />
					</svg>
				</div>
				<h3 class="step-title">Share</h3>
				<p class="step-description">Write your own review to help future members</p>
			</div>
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

	/* How It Works Section */
	.how-it-works {
		font-family: 'Mulish', sans-serif;
		margin-top: 30px;
	}

	.how-it-works-container {
		max-width: 98%;
		padding: 30px;
		margin: 0 auto;
	}

	.steps {
		display: flex;
		flex-direction: row;
		gap: 60px;
		align-items: start;
	}

	.step {
		text-align: center;
		padding: 0 20px;
	}

	.step-icon {
		width: 80px;
		height: 80px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px;
		box-shadow: 0 4px 20px rgba(194, 24, 7, 0.1);
		color: #c21807;
		transition: all 0.3s ease;
	}

	.step-icon:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 30px rgba(194, 24, 7, 0.2);
	}

	.step-title {
		font-size: 24px;
		font-weight: 700;
		color: #333;
		margin-bottom: 16px;
	}

	.step-description {
		font-size: 16px;
		color: #666;
		line-height: 1.5;
		margin: 0;
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

		.steps {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.step-icon {
			width: 70px;
			height: 70px;
		}

		.step-title {
			font-size: 22px;
		}

		.step-description {
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

		.how-it-works {
			padding: 10px;
		}
		.how-it-works-container {
			margin-bottom: -30px;
		}

		.step {
			padding: 0 15px;
		}

		.step-icon {
			width: 40px;
			height: 40px;
		}

		.step-icon svg {
			width: 24px;
		}

		.step-title {
			font-size: 20px;
		}
		.step-description {
			display: none;
		}
	}
</style>
