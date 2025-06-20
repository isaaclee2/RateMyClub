<script>
	import { onMount } from 'svelte';
	let { children, data } = $props();
	let { supabase, session } = $derived(data);
	const user = $derived(data.session?.user);

	let showSignInPopup = $state(false);

	function openSignInPopup() {
		showSignInPopup = true;
	}

	function closeSignInPopup() {
		showSignInPopup = false;
	}

	function handleGoogleSignIn() {
		closeSignInPopup(); // Close popup before form submission
	}

	onMount(() => {
		// Add escape key listener
		function handleKeydown(event) {
			if (event.key === 'Escape' && showSignInPopup) {
				closeSignInPopup();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const mostFrequentClubDetails = $derived(() => {
		if (!data.reviews || data.reviews.length === 0) {
			return { size: 'Unknown', selectivity: 'Unknown' };
		}
		const sizeCount = {};
		const selectivityCount = {};
		data.reviews.forEach((review) => {
			if (review.members_estimate) {
				sizeCount[review.members_estimate] = (sizeCount[review.members_estimate] || 0) + 1;
			}
			if (review.selectivity_estimate) {
				selectivityCount[review.selectivity_estimate] =
					(selectivityCount[review.selectivity_estimate] || 0) + 1;
			}
		});

		let mostFrequentSize = 'Unknown';
		let maxSizeCount = 0;
		for (const [size, count] of Object.entries(sizeCount)) {
			if (count > maxSizeCount) {
				maxSizeCount = count;
				mostFrequentSize = size;
			}
		}
		let mostFrequentSelectivity = 'Unknown';
		let maxSelectivityCount = 0;
		for (const [selectivity, count] of Object.entries(selectivityCount)) {
			if (count > maxSelectivityCount) {
				maxSelectivityCount = count;
				mostFrequentSelectivity = selectivity;
			}
		}

		return {
			size: mostFrequentSize,
			selectivity: mostFrequentSelectivity
		};
	});
</script>

<div class="content-container">
	<div class="header-container">
		<img src={data.club.image} alt="No Logo :(" />
		<div class="club-header-container">
			<div class="club-header">
				<div class="title-category-container">
					<h1 class="club-title">{data.club.name}</h1>
				</div>
			</div>
			<div class="overall-rating-container">
				<h1 class="overall-rating">
					{#each Array(5) as _, i}
						<span class="star {i < Math.round(data.club.overall_rating || 0) ? 'filled' : 'empty'}"
							>★</span
						>
					{/each}
				</h1>
				<h1 class="overall-score">({data.club.overall_rating || 0})</h1>
				{#if data.reviews.length == 1}
					<h1 class="number-of-ratings">{data.reviews.length} rating</h1>
				{:else}
					<h1 class="number-of-ratings">{data.reviews.length} ratings</h1>
				{/if}
			</div>
		</div>
	</div>

	<hr class="hr" />
	<div class="breadcrumb">
		<a href="/">Home</a> >
		<a href="/all-clubs">Clubs</a> >
		<span class="current">{data.club.name}</span>
	</div>

	<div class="big-container">
		<div class="container1">
			<div class="club-info">
				<div class="mission-header">Mission Statement:</div>
				<div class="mission-statement">{data.club.mission}</div>

				<div class="group">
					<div class="category-header">Categories:</div>
					<div class="club-cateogry">{data.club.categories}</div>
				</div>

				<div class="group">
					<div class="website-header">Website:</div>
					<div class="link">
						<a href={data.club.website} target="_blank" class="website-link">{data.club.website}</a>
					</div>
				</div>

				<div class="update-section">
					<div class="update-header">Club Board Member?</div>
					{#if user}
						<a href="/club/{data.club.slug}/update" class="update-info-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								width="18"
								height="18"
								stroke-width="2"
							>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
								<path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
							</svg>
							Request Club Info Update
						</a>
					{:else}
						<button onclick={openSignInPopup} class="update-info-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								width="18"
								height="18"
								stroke-width="2"
							>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
								<path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
							</svg>
							Sign in to update club info
						</button>
					{/if}
				</div>
			</div>
		</div>
		<div class="container2">
			<div class="box">
				<div class="box-header-container">
					<div class="breakdown-container">
						<h1 class="breakdown-header">Rating breakdown:</h1>
						<div class="rating-breakdown">
							<div class="rating-item">
								<div class="criteria-label">
									<svg
										class="breakdown-svg"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="24"
										height="24"
										stroke-width="2"
									>
										<path
											d="M11 6.5h2M11 18h2m-7-5v-2m12 2v-2M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm12 0h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0-12h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"
										/>
									</svg>
									Leadership & Organization
								</div>
								<div class="rating-stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(data.club.leadership_rating || 0)
												? 'filled'
												: 'empty'}">★</span
										>
									{/each}
									<div class="sub-rating">({(data.club.leadership_rating || 0).toFixed(1)})</div>
								</div>
							</div>

							<div class="rating-item">
								<div class="criteria-label">
									<svg
										class="breakdown-svg"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="24"
										height="24"
										stroke-width="2"
									>
										<path
											d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
									Inclusivity & Diversity
								</div>
								<div class="rating-stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(data.club.inclusivity_rating || 0)
												? 'filled'
												: 'empty'}">★</span
										>
									{/each}
									<div class="sub-rating">({(data.club.inclusivity_rating || 0).toFixed(1)})</div>
								</div>
							</div>

							<div class="rating-item">
								<div class="criteria-label">
									<svg
										class="breakdown-svg"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="24"
										height="24"
										stroke-width="2"
									>
										<path d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207" />
									</svg>
									Professional/Personal Development
								</div>
								<div class="rating-stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(data.club.development_rating || 0)
												? 'filled'
												: 'empty'}">★</span
										>
									{/each}
									<div class="sub-rating">({(data.club.development_rating || 0).toFixed(1)})</div>
								</div>
							</div>

							<div class="rating-item">
								<div class="criteria-label">
									<svg
										class="breakdown-svg"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="24"
										height="24"
										stroke-width="2"
									>
										<path
											d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
										/>
									</svg>
									Social Engagement
								</div>
								<div class="rating-stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(data.club.social_rating || 0)
												? 'filled'
												: 'empty'}">★</span
										>
									{/each}
									<div class="sub-rating">({(data.club.social_rating || 0).toFixed(1)})</div>
								</div>
							</div>

							<div class="rating-item">
								<div class="criteria-label">
									<svg
										id="Mail_Smiley_Happy_Face_24"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										><rect width="24" height="24" stroke="none" fill="#000000" opacity="0" />

										<g transform="matrix(1.43 0 0 1.43 12 12)">
											<g style="">
												<g transform="matrix(1 0 0 1 0 0)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-7, -7)"
														d="M 7 13.5 C 10.5899 13.5 13.5 10.5899 13.5 7 C 13.5 3.41015 10.5899 0.5 7 0.5 C 3.41015 0.5 0.5 3.41015 0.5 7 C 0.5 10.5899 3.41015 13.5 7 13.5 Z"
														stroke-linecap="round"
													/>
												</g>
												<g transform="matrix(1 0 0 1 0 2.26)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-7, -9.26)"
														d="M 3.7 8 C 4.2 9.8 6.2 10.9 8 10.4 C 9.1 10 10 9.1 10.3 8"
														stroke-linecap="round"
													/>
												</g>
												<g transform="matrix(1 0 0 1 -2.33 -1.8)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-4.67, -5.2)"
														d="M 4.8 5.45 C 4.66193 5.45 4.55 5.33807 4.55 5.2 C 4.55 5.06193 4.66193 4.95 4.8 4.95"
														stroke-linecap="round"
													/>
												</g>
												<g transform="matrix(1 0 0 1 -2.08 -1.8)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-4.92, -5.2)"
														d="M 4.8 5.45 C 4.93807 5.45 5.05 5.33807 5.05 5.2 C 5.05 5.06193 4.93807 4.95 4.8 4.95"
														stroke-linecap="round"
													/>
												</g>
												<g transform="matrix(1 0 0 1 2.07 -1.8)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-9.07, -5.2)"
														d="M 9.2 5.45 C 9.06193 5.45 8.95 5.33807 8.95 5.2 C 8.95 5.06193 9.06193 4.95 9.2 4.95"
														stroke-linecap="round"
													/>
												</g>
												<g transform="matrix(1 0 0 1 2.32 -1.8)">
													<path
														style="stroke: rgb(0,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
														transform=" translate(-9.32, -5.2)"
														d="M 9.2 5.45 C 9.33807 5.45 9.45 5.33807 9.45 5.2 C 9.45 5.06193 9.33807 4.95 9.2 4.95"
														stroke-linecap="round"
													/>
												</g>
											</g>
										</g>
									</svg>
									Overall Vibes
								</div>
								<div class="rating-stars">
									{#each Array(5) as _, i}
										<span
											class="star {i < Math.round(data.club.overall_vibes_rating || 0)
												? 'filled'
												: 'empty'}">★</span
										>
									{/each}
									<div class="sub-rating">({(data.club.overall_vibes_rating || 0).toFixed(1)})</div>
								</div>
							</div>
						</div>
					</div>
					<div class="club-details-container">
						<div>
							<h1 class="club-details-header">Club details:</h1>
							<div class="club-details-breakdown">
								<div class="detail-item">
									<div class="detail-label">
										<svg
											class="breakdown-svg"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											width="24"
											height="24"
											stroke-width="2"
										>
											<path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
											<path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"></path>
											<path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
											<path d="M17 10h2a2 2 0 0 1 2 2v1"></path>
											<path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
											<path d="M3 13v-1a2 2 0 0 1 2 -2h2"></path>
										</svg>
										Size:
									</div>
									<div class="detail-value">
										{#if mostFrequentClubDetails().size === 'Small'}
											Small (1-10 members)
										{:else if mostFrequentClubDetails().size === 'Medium'}
											Medium (10-30 members)
										{:else if mostFrequentClubDetails().size === 'Large'}
											Large (30-50 members)
										{:else if mostFrequentClubDetails().size === 'Huge'}
											Huge (50+ members)
										{:else}
											{mostFrequentClubDetails().size}
										{/if}
									</div>
								</div>

								<div class="detail-item">
									<div class="detail-label">
										<svg
											class="breakdown-svg"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											width="24"
											height="24"
											stroke-width="2"
										>
											<path d="M15 13v4"></path>
											<path d="M13 15h4"></path>
											<path d="M15 15m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
											<path d="M22 22l-3 -3"></path>
											<path d="M6 18h-1a2 2 0 0 1 -2 -2v-1"></path>
											<path d="M3 11v-1"></path>
											<path d="M3 6v-1a2 2 0 0 1 2 -2h1"></path>
											<path d="M10 3h1"></path>
											<path d="M15 3h1a2 2 0 0 1 2 2v1"></path>
										</svg>
										Selectivity:
									</div>
									<div class="detail-value">
										{#if mostFrequentClubDetails().selectivity === 'Open to all!'}
											Open to all!
										{:else if mostFrequentClubDetails().selectivity === 'Moderate'}
											Moderate (&lt;50%)
										{:else if mostFrequentClubDetails().selectivity === 'High'}
											High (&lt;20%)
										{:else}
											{mostFrequentClubDetails().selectivity}
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
					{#if user}
						<a href="/club/{data.club.slug}/review" class="review-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 22 22"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								width="22"
								height="22"
								stroke-width="2"
							>
								<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
								<path d="M13.5 6.5l4 4"></path>
							</svg>
							&nbspWrite a review
						</a>
					{:else}
						<button onclick={openSignInPopup} class="review-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 22 22"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								width="22"
								height="22"
								stroke-width="2"
							>
								<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
								<path d="M13.5 6.5l4 4"></path>
							</svg>
							&nbsp Sign in to review
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<hr class="hr1" />
	<div class="reviews-container">
		<h1 class="reviews-header">Reviews ({data.reviews.length})</h1>
		{#if data.reviews.length === 0}
			<div class="no-reviews-content">
				<div class="no-reviews">No reviews yet. Be the first to write one!</div>
			</div>
		{:else}
			<div class="reviews-list">
				{#each data.reviews as review}
					{@const avgRating =
						(review.leadership_rating +
							review.inclusivity_rating +
							review.development_rating +
							review.social_rating +
							review.overall_rating) /
						5}
					<div class="review-item">
						<div class="review-header">
							<div class="review-meta">
								<div class="review-date">
									{new Date(review.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</div>
								<div class="review-rating">
									<div class="stars">
										{#each Array(5) as _, i}
											<span class="star {i < Math.round(avgRating) ? 'filled' : 'empty'}">★</span>
										{/each}
									</div>
									<div class="rating-text">{avgRating.toFixed(1)}/5</div>
								</div>
							</div>
						</div>
						<div class="review-content">
							<p>{review.review_text}</p>
						</div>
						<div class="review-criteria">
							<div class="criteria-item">
								<div class="criteria-label">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="16"
										height="16"
										stroke-width="2"
									>
										<path
											d="M11 6.5h2M11 18h2m-7-5v-2m12 2v-2M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm12 0h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0-12h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"
										/>
									</svg>
									Leadership: {review.leadership_rating}
								</div>
							</div>
							<div class="criteria-item">
								<div class="criteria-label">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="16"
										height="16"
										stroke-width="2"
									>
										<path
											d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
									Inclusivity: {review.inclusivity_rating}
								</div>
							</div>
							<div class="criteria-item">
								<div class="criteria-label">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="16"
										height="16"
										stroke-width="2"
									>
										<path d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207" />
									</svg>
									Development: {review.development_rating}
								</div>
							</div>
							<div class="criteria-item">
								<div class="criteria-label">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="16"
										height="16"
										stroke-width="2"
									>
										<path
											d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
										/>
									</svg>
									Social: {review.social_rating}
								</div>
							</div>
							<div class="criteria-item">
								<div class="criteria-label">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										width="14"
										height="14"
										stroke-width="2"
									>
										<path
											d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
										/>
									</svg>
									Overall vibes: {review.overall_rating}
								</div>
							</div>
						</div>
						<div class="review-membership">
							<div class="member-info">
								<span class="estimate1">Selectivity: {review.selectivity_estimate}</span>
								<span class="estimate2">Size: {review.members_estimate}</span>
							</div>
							<div class="member-info">
								<span class="member-badge">{review.connection}</span>
								<span class="selectivity-badge">Joined as a {review.year_joined}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Sign In Popup -->
{#if showSignInPopup}
	<div class="popup-overlay">
		<div class="popup-content">
			<button class="close-btn" onclick={closeSignInPopup}>×</button>
			<div class="popup-header">
				<h2>Sign In to RateMyClub</h2>
			</div>
			<div class="popup-body">
				<p class="popup-description">
					Join our community to rate and review USC clubs! Sign in with your USC Google account to
					get started.
				</p>
				<p class="popup-description">Your information will be kept confidential.</p>
				<form method="POST" action="/auth?/google" class="google-signin-form">
					<button type="submit" class="google-signin-btn">
						<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with USC Google
					</button>
				</form>
				<div class="popup-note">
					<small>Only USC students and staff (@usc.edu) can sign in</small>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Content Styling */
	.content-container {
		max-width: 1300px;
		margin: 0px auto 0px;
		margin-top: -10px;
		padding: 0 10px;
		font-family: 'Mulish', sans-serif;
	}

	.breadcrumb {
		margin-bottom: 20px;
		font-size: 14px;
		color: #666;
		margin-left: 10px;
	}
	.breadcrumb a {
		color: #c21807;
		text-decoration: none;
	}
	.breadcrumb a:hover {
		text-decoration: underline;
	}
	.breadcrumb .current {
		font-weight: bold;
	}

	.header-container {
		display: flex;
		flex-direction: row;
		margin-top: 10px;
	}
	img {
		height: 80px;
		margin-right: 10px;
		margin-top: 10px;
		border-radius: 8px;
	}

	.club-header {
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.club-header-container {
		display: flex;
		flex-direction: column;
	}
	.title-category-container {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
	}
	.club-title {
		font-size: 32px;
		font-weight: 700;
		margin: 0;
		color: #333;
	}
	.overall-rating-container {
		display: flex;
		flex-direction: row;
	}
	.overall-rating {
		margin-left: 10px;
		margin-top: -20px;
		font-size: 35px;
		color: #ffa534;
	}
	.overall-score {
		margin-left: 10px;
		margin-top: -8px;
		font-size: 20px;
		color: #ffa534;
	}
	.number-of-ratings {
		margin-left: 20px;
		margin-top: -4px;
		font-weight: bold;
	}

	.hr {
		margin-top: 10px;
		margin-bottom: 20px;
		width: 100%;
	}
	.hr1 {
		margin-top: 30px;
		margin-bottom: 20px;
		width: 100%;
	}
	.big-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: -10px;
	}
	.container1 {
		width: 60%;
		padding: 10px;
		margin-left: 15px;
	}
	.club-info {
		width: 95%;
	}
	.group {
		display: flex;
		flex-direction: row;
		margin-bottom: 40px;
		margin-top: 10px;
	}
	.mission-header {
		margin-top: 0px;
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}
	.mission-statement {
		margin: 20px 0px 30px 0px;
		width: fit-content;
		background-color: #f7f7f7f6;
		padding: 10px 10px 10px 20px;
		font-style: italic;
		border-radius: 20px;
		color: #555;
		border-left: 4px solid #c21807;
		word-spacing: 2px;
		line-height: 1.7;
	}
	.update-section {
		margin-top: 20px;
	}

	.update-header {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		margin-bottom: 10px;
	}

	.update-info-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #999;
		color: white;
		padding: 8px 13px;
		border: none;
		border-radius: 8px;
		text-decoration: none;
		font-family: 'Mulish', sans-serif;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.update-info-button:hover {
		background-color: #777;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.update-info-button svg {
		margin-right: 0;
		margin-top: 0;
	}

	.website-header {
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}
	.website-link {
		color: #3d91cd;
	}
	.link {
		width: fit-content;
		padding: 4px;
		margin-left: 30px;
		border-radius: 13px;
		border-left: 0;
	}
	.website-link:hover {
		text-decoration: underline;
	}
	.category-header {
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}

	.club-cateogry {
		width: fit-content;
		margin-left: 15px;
		font-size: 15px;
		color: #666;
		background-color: #f7f7f7f6;
		padding: 7px 15px 7px 15px;
		border-radius: 30px;
		font-style: italic;
	}
	.container2 {
		width: 40%;
		padding: 0px;
		margin-left: 0px;
	}
	.box {
		width: fit-content;
		height: fit-content;
		margin-top: -30px;
		background-color: white;
		border-radius: 20px;
		border-color: #dfdfdf;
		border-width: 1px;
		border-style: solid;
	}
	.box-header-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 10px;
	}

	.breakdown-container {
		width: fit-content;
		padding: 30px;
		padding-bottom: 0;
	}

	.breakdown-header {
		font-weight: bold;
		font-size: 18px;
		margin-bottom: 20px;
		color: #c21807;
	}

	/* New grouped rating structure */
	.rating-breakdown {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.rating-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		min-width: 280px;
		gap: 20px;
	}

	.rating-stars {
		color: #ffa534;
		font-size: 17px;
		display: flex;
		flex-direction: row;
	}
	.sub-rating {
		font-size: 15px;
		padding: 1.5px;
		margin-left: 5px;
		margin-right: -10px;
	}

	svg {
		margin-right: 0;
		margin-top: -2px;
		flex-shrink: 0;
	}

	.club-details-container {
		width: 100%;
		padding: 30px;
		margin-left: 5px;
		font-size: 14px;
		display: flex;
		flex-direction: column;
	}
	.club-details-breakdown {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
		width: 100%;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		width: 100%;
	}
	.detail-label {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		font-size: 14px;
		min-width: 0;
	}

	.detail-value {
		color: #333;
		font-size: 14px;
		margin-left: 20px;
		text-align: right;
	}
	.club-details-header {
		font-weight: bold;
		font-size: 18px;
		margin-left: 0px;
		color: #c21807;
	}

	.review-button {
		width: 85%;
		height: 50px;
		padding: 8px;
		margin-bottom: 20px;
		margin-right: -10px;
		background-color: #c21807;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 18px;
		font-weight: bold;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		cursor: pointer;
		font-family: 'Mulish', sans-serif;
	}
	.review-button:hover {
		background-color: #a01400;
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
	}

	/* Popup Styles */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		font-family: 'Mulish', sans-serif;
	}

	.popup-content {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		max-width: 450px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.popup-header {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 24px 10px 24px;
		margin-bottom: 20px;
	}

	.popup-header h2 {
		margin: 0;
		color: #333;
		font-size: 24px;
		font-weight: 700;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 28px;
		color: #666;
		cursor: pointer;
		padding: 25px;
		padding-bottom: 10px;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.popup-body {
		padding: 0 24px 24px 24px;
	}

	.popup-description {
		color: #666;
		line-height: 1.6;
		margin-bottom: 24px;
		text-align: center;
	}

	.google-signin-form {
		width: 100%;
	}

	.google-signin-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 12px 20px;
		border: 2px solid #dadce0;
		border-radius: 8px;
		background-color: white;
		color: #3c4043;
		font-family: 'Mulish', sans-serif;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.google-signin-btn:hover {
		border-color: #c1c3c7;
		background-color: #f8f9fa;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.google-signin-btn:active {
		background-color: #f1f3f4;
	}

	.google-icon {
		flex-shrink: 0;
	}

	.popup-note {
		text-align: center;
		margin-top: 16px;
		color: #666;
	}

	.reviews-header {
		font-size: 30px;
		margin-left: 20px;
		margin-top: 20px;
		padding-bottom: 20px;
	}

	.no-reviews-content {
		width: 100%;
		border-radius: 12px;
		border: 1px solid #dfdfdf;
		padding: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f9f9f9;
	}

	.no-reviews {
		font-size: 18px;
		color: #666;
		text-align: center;
	}

	.reviews-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 40px;
	}

	.review-item {
		background-color: white;
		border-radius: 12px;
		border: 1px solid #dfdfdf;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.review-meta {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.review-date {
		color: #666;
		font-size: 14px;
	}

	.review-rating {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.stars {
		color: #ffa534;
		font-size: 18px;
		letter-spacing: 2px;
	}

	.star.filled {
		color: #ffa534;
	}

	.star {
		color: #d3d3d3;
	}

	.rating-text {
		font-size: 14px;
		font-weight: bold;
		color: #333;
	}

	.review-content {
		margin-bottom: 15px;
		line-height: 1.6;
		color: #333;
	}

	.review-content p {
		margin: 0;
	}

	.review-criteria {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		margin-bottom: 15px;
		padding-top: 10px;
		border-top: 1px solid #eee;
	}

	.criteria-item {
		background-color: #f7f7f7;
		border-radius: 8px;
		padding: 8px 12px;
	}

	.criteria-label {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 14px;
		flex: 1;
		min-width: 0;
	}

	.review-membership {
		display: flex;
		justify-content: space-between;
	}

	.member-info {
		display: flex;
		gap: 10px;
	}

	.member-badge,
	.selectivity-badge,
	.estimate1,
	.estimate2 {
		font-size: 12px;
		padding: 4px 8px;
		border-radius: 4px;
		font-weight: 900;
	}

	.member-badge {
		background-color: #e8f5e9;
		color: #2e7d32;
	}
	.selectivity-badge {
		background-color: #d8ebff;
		color: #0058cc;
	}
	.estimate1 {
		background-color: #f9e6e6;
		color: #e90202;
	}
	.estimate2 {
		background-color: #f9f3e6;
		color: #dc9301;
	}

	@media (max-width: 768px) {
		.container1 {
			width: 50%;
		}
		.container2 {
			margin-right: 70px;
		}
	}
	@media (max-width: 480px) {
		.club-title {
			font-size: 25px;
		}
		img {
			height: 60px;
			margin-top: 10px;
		}
		.overall-rating {
			font-size: 20px;
		}
		.overall-score {
			font-size: 15px;
			margin-top: -16px;
		}
		.number-of-ratings {
			font-size: 15px;
			margin-top: -15px;
		}
		.container1 {
			width: 100%;
		}
		.container2 {
			margin-top: 30px;
			width: 95%;
		}
		.big-container {
			flex-direction: column;
		}
		.group {
			margin-bottom: 0px;
		}
		.mission-statement,
		.club-cateogry,
		.link {
			font-size: 12px;
		}
		.mission-statement {
			margin-top: 15px;
			margin-bottom: 15px;
		}
		.club-cateogry,
		.link {
			margin-top: -3px;
		}
		.mission-header,
		.category-header,
		.website-header {
			font-size: 14px;
		}

		.club-details-header {
			margin-top: -10px;
		}

		.criteria-label {
			font-size: 14px;
		}

		.detail-value {
			font-size: 14px;
		}
		.breakdown-svg {
			width: 18px;
			height: 18px;
			margin-top: 0.5px;
		}
		.rating-stars {
			font-size: 16px;
		}
		.reviews-header {
			font-size: 24px;
		}

		.estimate1,
		.estimate2,
		.member-badge,
		.selectivity-badge {
			font-size: 8px;
		}
	}
</style>
