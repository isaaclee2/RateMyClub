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
		<!-- svelte-ignore event_directive_deprecated -->
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

{#if data.popularClubs && data.popularClubs.length > 0}
	<div class="popular-clubs">
		<div class="popular-clubs-container">
			<h2 class="popular-clubs-title">Popular Clubs</h2>
			<p class="popular-clubs-subtitle">Most reviewed clubs at USC</p>

			<div class="clubs-grid">
				{#each data.popularClubs as club}
					<a href="/club/{club.slug}" class="club-card">
						<div class="club-image">
							<img src={club.image} alt="{club.name} logo" />
						</div>
						<div class="club-info">
							<h3 class="club-name">{club.name}</h3>
							<div class="club-rating">
								<div class="stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(club.overall_rating || 0) ? 'filled' : 'empty'}"
											>★</span
										>
									{/each}
								</div>
								<span class="rating-text">({club.overall_rating || 0})</span>
							</div>
							{#if club.review_count == 1}
								<div class="review-count">{club.review_count || 0} review</div>
							{:else}
								<div class="review-count">{club.review_count || 0} reviews</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

<div class="line">
	<hr class="hr" />
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
		justify-content: center;
	}

	.step {
		text-align: center;
		padding: 0 20px;
		flex: 1;
		max-width: 300px;
	}

	.step-icon {
		width: 80px !important;
		height: 80px !important;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
		box-shadow: 0 4px 20px rgba(194, 24, 7, 0.1);
		color: #c21807;
		transition: all 0.3s ease;
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
	.line {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -30px;
	}
	.hr {
		width: 90%;
		text-align: center;
	}
	/* Popular Clubs Section */
	.popular-clubs {
		background-color: white;
		padding: 40px 0;
		font-family: 'Mulish', sans-serif;
	}

	.popular-clubs-container {
		max-width: 90%;
		margin: 0 auto;
		padding: 0 20px;
	}

	.popular-clubs-title {
		font-size: 30px;
		font-weight: 700;
		text-align: left;
		color: #333;
		margin-bottom: 10px;
	}

	.popular-clubs-subtitle {
		font-size: 16px;
		text-align: left;
		color: #666;
		margin-bottom: 40px;
	}

	.clubs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
		justify-items: center;
	}

	.club-card {
		background: white;
		border-radius: 12px;
		padding: 20px;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
		border: 1px solid #eee;
		width: 100%;
		max-width: 250px;
		aspect-ratio: 1; /* Always square */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.club-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.club-image {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 0px;
		flex-shrink: 0;
	}

	.club-image img {
		width: 80px;
		height: 80px;
		object-fit: contain;
		border-radius: 8px;
		margin-top: 15px;
	}

	.club-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex-grow: 1;
		width: 100%;
	}

	.club-name {
		font-size: 16px;
		font-weight: 700;
		color: #333;
		margin-bottom: 12px;
		margin-top: 0px;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.club-rating {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-bottom: 8px;
		flex-wrap: wrap;
	}

	.stars {
		color: #ffa534;
		font-size: 16px;
		line-height: 1;
	}

	.star.filled {
		color: #ffa534;
	}

	.star.empty {
		color: #d3d3d3;
	}

	.rating-text {
		font-size: 13px;
		color: #666;
		font-weight: 600;
	}

	.review-count {
		font-size: 13px;
		color: #666;
		margin-bottom: 0px;
		line-height: 1;
	}

	/* Tablet/Desktop - larger squares */
	@media (min-width: 769px) {
		.clubs-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 25px;
		}

		.club-card {
			max-width: 280px;
			padding: 25px;
		}
		.club-name {
			font-size: 20px;
			margin-bottom: 15px;
		}

		.rating-text {
			font-size: 14px;
		}

		.review-count {
			font-size: 14px;
		}

		.stars {
			font-size: 18px;
		}
	}

	/* Medium screens - medium squares */
	@media (max-width: 768px) and (min-width: 481px) {
		.popular-clubs-title {
			font-size: 24px;
		}

		.popular-clubs-subtitle {
			font-size: 14px;
		}

		.clubs-grid {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
		}

		.club-card {
			max-width: 220px;
			padding: 18px;
		}

		.club-image img {
			width: 60px !important;
			height: 60px !important;
		}

		.club-name {
			font-size: 16px;
			margin-bottom: 10px;
		}

		.rating-text {
			font-size: 12px;
		}

		.review-count {
			font-size: 12px;
		}

		.stars {
			font-size: 15px;
		}
	}

	/* Small screens - compact squares */
	@media (max-width: 480px) {
		.popular-clubs {
			padding: 40px 0;
		}

		.popular-clubs-title {
			font-size: 20px;
		}

		.popular-clubs-subtitle {
			font-size: 14px;
		}

		.clubs-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
			gap: 15px;
		}

		.club-card {
			max-width: 160px;
			padding: 15px;
		}

		.club-image {
			margin-bottom: 8px;
		}

		.club-image img {
			width: 50px;
			height: 50px;
		}

		.club-name {
			font-size: 13px;
			margin-bottom: 8px;
			line-height: 1.1;
		}

		.club-rating {
			gap: 5px;
			margin-bottom: 6px;
		}

		.rating-text {
			font-size: 10px;
		}

		.review-count {
			font-size: 10px;
		}

		.stars {
			font-size: 12px;
		}
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

		.how-it-works-container {
			margin-bottom: -30px;
		}

		.step-icon {
			width: 50px !important;
			height: 50px !important;
		}

		.step-icon svg {
			width: 22px;
		}

		.step-title {
			font-size: 18px;
		}
		.step-description {
			display: none;
		}
	}
</style>
