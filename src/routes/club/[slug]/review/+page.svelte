<script>
	export let data;
	let showReviewForm = false; //default false
	let reviewFormRef;

	let connectoin = '';
	let year = '';

	let reviewFormRef2;
	let showReview2 = false; // default false

	let leadershipRating = 0;
	let inclusivityRating = 0;
	let developmentRating = 0;
	let socialRating = 0;
	let overallVibes = 0;

	let showReview3 = false; // default false
	let reviewFormRef3;

	let membersOneToFour = 0;
	let selectivityOneToFour = 0;

	let showReview4 = false; // default false
	let reviewFormRef4;

	let reviewText = '';

	function handleAccept() {
		showReviewForm = true;
		setTimeout(() => {
			if (reviewFormRef) {
				reviewFormRef.scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	}

	function handleNext2() {
		const connectionChoice = document.querySelector('input[name="connection"]:checked');
		const yearChoice = document.querySelector('input[name="year"]:checked');

		if (!connectionChoice || !yearChoice) {
			alert('Please fill out all fields.');
			return;
		}

		connectoin = connectionChoice.value;
		year = yearChoice.value;
		showReview2 = true;
		setTimeout(() => {
			if (reviewFormRef2) {
				reviewFormRef2.scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	}

	function handleNext3() {
		if (
			!leadershipRating ||
			!inclusivityRating ||
			!developmentRating ||
			!socialRating ||
			!overallVibes
		) {
			alert('Please fill out all fields.');
			return;
		}
		showReview3 = true;
		setTimeout(() => {
			if (reviewFormRef3) {
				reviewFormRef3.scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	}

	function handleNext4() {
		const membersChoice = document.querySelector('input[name="members"]:checked');
		const selectivityChoice = document.querySelector('input[name="selective"]:checked');

		if (!membersChoice || !selectivityChoice) {
			alert('Please fill out all fields.');
			return;
		}

		membersOneToFour = membersChoice.value;
		selectivityOneToFour = selectivityChoice.value;
		showReview4 = true;
		setTimeout(() => {
			if (reviewFormRef4) {
				reviewFormRef4.scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	}

	function setRating(category, rating) {
		switch (category) {
			case 'leadership':
				leadershipRating = rating;
				break;
			case 'inclusivity':
				inclusivityRating = rating;
				break;
			case 'development':
				developmentRating = rating;
				break;
			case 'social':
				socialRating = rating;
				break;
			case 'overall':
				overallVibes = rating;
				break;
		}
	}
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
				<h1 class="overall-rating">★★★★★</h1>
				<h1 class="overall-score">({data.club.overall_rating})</h1>
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
		<a href="/club/{data.club.slug}" class="current">{data.club.name}</a> >
		<span class="current">Review</span>
	</div>

	<div class="integrity-notice">
		<div class="notice-icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				width="40"
				height="40"
				stroke-width="2"
			>
				<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
				></path>
				<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
				></path>
				<path d="M9 12h6"></path>
				<path d="M9 16h6"></path>
			</svg>
		</div>
		<div class="notice-content">
			<h3>Review Integrity Notice!</h3>
			<p>
				Our community relies on honest feedback to help students find the right clubs for them.
				Please share your genuine experience only for clubs you've actually participated in.
				Artificially boosting your own club's ratings or intentionally sabotaging others violates
				our community guidelines and undermines the purpose of this platform. Help us maintain
				RateMyClub as a trusted resource by contributing authentic, fair reviews.
			</p>
			{#if !showReviewForm}
				<button class="accept-button" on:click={handleAccept}>I understand</button>
			{:else}
				<div class="accepted-message">Thank you for your understanding!</div>
			{/if}
		</div>
	</div>

	{#if showReviewForm}
		<div class="review-form-container" bind:this={reviewFormRef}>
			<h1 class="review-section-header">1. Your Information</h1>
			<p class="privacy-notice">
				We value your privacy. Your information will be kept confidential.
			</p>
			<h2 class="review-question">What is your connection to the club?</h2>

			<div class="radio-group">
				<div class="radio-option">
					<input type="radio" id="eboard" name="connection" value="E-board" required />
					<label for="eboard">
						<span class="radio-custom"></span>
						<span class="radio-label">E-board</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="current-member" name="connection" value="Current Member" />
					<label for="current-member">
						<span class="radio-custom"></span>
						<span class="radio-label">Current Member</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="past-member" name="connection" value="Past Member" />
					<label for="past-member">
						<span class="radio-custom"></span>
						<span class="radio-label">Past Member</span>
					</label>
				</div>
			</div>

			<h2 class="review-question">In what grade did you join the club?</h2>

			<div class="radio-group">
				<div class="radio-option">
					<input type="radio" id="freshman" name="year" value="Freshman" required />
					<label for="freshman">
						<span class="radio-custom"></span>
						<span class="radio-label">Freshman</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="sophomore" name="year" value="Sophomore" />
					<label for="sophomore">
						<span class="radio-custom"></span>
						<span class="radio-label">Sophomore</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="junior" name="year" value="Junior" />
					<label for="junior">
						<span class="radio-custom"></span>
						<span class="radio-label">Junior</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="senior" name="year" value="Senior" />
					<label for="senior">
						<span class="radio-custom"></span>
						<span class="radio-label">Senior</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="graduate" name="year" value="Graduate Student" />
					<label for="graduate">
						<span class="radio-custom"></span>
						<span class="radio-label">Graduate Student</span>
					</label>
				</div>
			</div>

			<button class="next-button" on:click={handleNext2}>Next</button>
		</div>
	{/if}

	{#if showReview2}
		<div class="review-form-container" bind:this={reviewFormRef2}>
			<h1 class="review-section-header">2. Rating</h1>

			<h2 class="review-question">Leadership & Organization</h2>
			<h3>How well is the club managed?</h3>
			<div class="star-rating">
				<div class="stars" data-category="leadership">
					{#each Array(5) as _, i}
						<span
							class="star {i < leadershipRating ? 'selected' : ''}"
							on:click={() => setRating('leadership', i + 1)}
							on:keydown={(e) => e.key === 'Enter' && setRating('leadership', i + 1)}
							tabindex="0"
							role="button"
							aria-label="Rate {i + 1} star{i !== 0 ? 's' : ''}">★</span
						>
					{/each}
				</div>
				<span class="rating-value">{leadershipRating ? leadershipRating : ''}</span>
			</div>

			<h2 class="review-question">Inclusivity & Diversity</h2>
			<h3>How open/welcoming is the club to new members?</h3>
			<div class="star-rating">
				<div class="stars" data-category="inclusivity">
					{#each Array(5) as _, i}
						<span
							class="star {i < inclusivityRating ? 'selected' : ''}"
							on:click={() => setRating('inclusivity', i + 1)}
							on:keydown={(e) => e.key === 'Enter' && setRating('inclusivity', i + 1)}
							tabindex="0"
							role="button"
							aria-label="Rate {i + 1} star{i !== 0 ? 's' : ''}">★</span
						>
					{/each}
				</div>
				<span class="rating-value">{inclusivityRating ? inclusivityRating : ''}</span>
			</div>

			<h2 class="review-question">Professional & Personal Development</h2>
			<h3>How has the club contributed to your personal or professional growth?</h3>
			<div class="star-rating">
				<div class="stars" data-category="development">
					{#each Array(5) as _, i}
						<span
							class="star {i < developmentRating ? 'selected' : ''}"
							on:click={() => setRating('development', i + 1)}
							on:keydown={(e) => e.key === 'Enter' && setRating('development', i + 1)}
							tabindex="0"
							role="button"
							aria-label="Rate {i + 1} star{i !== 0 ? 's' : ''}">★</span
						>
					{/each}
				</div>
				<span class="rating-value">{developmentRating ? developmentRating : ''}</span>
			</div>

			<h2 class="review-question">Social Engagement</h2>
			<h3>How active is the club socially?</h3>
			<div class="star-rating">
				<div class="stars" data-category="social">
					{#each Array(5) as _, i}
						<span
							class="star {i < socialRating ? 'selected' : ''}"
							on:click={() => setRating('social', i + 1)}
							on:keydown={(e) => e.key === 'Enter' && setRating('social', i + 1)}
							tabindex="0"
							role="button"
							aria-label="Rate {i + 1} star{i !== 0 ? 's' : ''}">★</span
						>
					{/each}
				</div>
				<span class="rating-value">{socialRating ? socialRating : ''}</span>
			</div>

			<h2 class="review-question">Overall Vibes</h2>
			<div class="star-rating">
				<div class="stars" data-category="overall">
					{#each Array(5) as _, i}
						<span
							class="star {i < overallVibes ? 'selected' : ''}"
							on:click={() => setRating('overall', i + 1)}
							on:keydown={(e) => e.key === 'Enter' && setRating('overall', i + 1)}
							tabindex="0"
							role="button"
							aria-label="Rate {i + 1} star{i !== 0 ? 's' : ''}">★</span
						>
					{/each}
				</div>
				<span class="rating-value">{overallVibes ? overallVibes : ''}</span>
			</div>

			<button class="next-button" on:click={handleNext3}>Next</button>
		</div>
	{/if}

	{#if showReview3}
		<div class="review-form-container" bind:this={reviewFormRef3}>
			<h1 class="review-section-header">3. Club Information</h1>
			<h2 class="review-question">How many members are in the club?</h2>
			<div class="radio-group">
				<div class="radio-option">
					<input type="radio" id="small" name="members" value="Small" required />
					<label for="small">
						<span class="radio-custom"></span>
						<span class="radio-label">Small (1-10)</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="medium" name="members" value="Medium" required />
					<label for="medium">
						<span class="radio-custom"></span>
						<span class="radio-label">Medium (10-30)</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="large" name="members" value="Large" required />
					<label for="large">
						<span class="radio-custom"></span>
						<span class="radio-label">Large (30-50)</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="huge" name="members" value="Huge" required />
					<label for="huge">
						<span class="radio-custom"></span>
						<span class="radio-label">Huge (50+)</span>
					</label>
				</div>
			</div>
			<h2 class="review-question">How competitive is the application process?</h2>
			<div class="radio-group">
				<div class="radio-option">
					<input type="radio" id="open" name="selective" value="Open" required />
					<label for="open">
						<span class="radio-custom"></span>
						<span class="radio-label">Open to all!</span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="moderate" name="selective" value="Moderate" required />
					<label for="moderate">
						<span class="radio-custom"></span>
						<span class="radio-label">Moderate ( &lt;50% acceptance) </span>
					</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="high" name="selective" value="High" required />
					<label for="high">
						<span class="radio-custom"></span>
						<span class="radio-label">High ( &lt;20% acceptance)</span>
					</label>
				</div>
			</div>
			<button class="next-button" on:click={handleNext4}>Next</button>
		</div>
	{/if}

	{#if showReview4}
		<div class="review-form-container" bind:this={reviewFormRef4}>
			<h1 class="review-section-header">4. Your Review</h1>
			<h2 class="review-question">Please share any thoughts about the club!</h2>
			<textarea
				class="review-textbox"
				placeholder="Write your review here..."
				bind:value={reviewText}
			></textarea>
		</div>

		<button class="submit-button" on:click>Submit Review</button>
	{/if}
</div>

<style>
	.content-container {
		max-width: 1300px;
		margin: 0px auto 0px;
		margin-top: -10px;
		padding: 0 10px;
		font-family: 'Mulish', sans-serif;
	}
	.breadcrumb {
		font-family: 'Mulish', sans-serif;
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
		margin-top: 20px;
	}
	img {
		height: 80px;
		margin-right: 10px;
		margin-top: 10px;
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

	/* Integrity Notice Styling */
	.integrity-notice {
		background-color: #f8f9fa;
		border-left: 4px solid #c21807;
		border-radius: 6px;
		padding: 20px;
		margin: 20px 0 30px 0;
		display: flex;
		align-items: flex-start;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	.notice-icon {
		font-size: 24px;
		margin-right: 15px;
		color: #c21807;
	}
	.notice-content h3 {
		margin: 0 0 10px 0;
		color: #333;
		font-weight: 700;
	}
	.notice-content p {
		margin: 0 0 20px 0;
		line-height: 1.5;
		color: #555;
	}
	.accept-button {
		background-color: #c21807;
		color: white;
		border: none;
		border-radius: 10px;
		padding: 10px 20px;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 10px;
	}
	.accept-button:hover {
		background-color: #a01505;
	}
	.accepted-message {
		color: #2e7d32;
		font-weight: 600;
		margin-top: 15px;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
	.accepted-message::before {
		content: '✓';
		background-color: #2e7d32;
		color: white;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-right: 8px;
		font-size: 12px;
	}

	/* Review Form Styling */
	.review-form-container {
		background-color: #fff;
		border-radius: 6px;
		padding: 25px;
		margin: 20px 0 30px 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		animation: fadeIn 0.5s ease-out;
		scroll-margin-top: 20px;
	}
	.review-section-header {
		font-size: 40px;
		color: #c21807;
	}
	.privacy-notice {
		font-size: 15px;
		margin-top: 10px;
		margin-left: 5px;
	}
	.review-question {
		margin-top: 30px;
		font-size: 30px;
	}
	h3 {
		font-size: 18px;
		margin-top: 10px;
	}

	/* Star Rating Styling */
	.star-rating {
		display: flex;
		align-items: center;
		margin: 15px 0 25px;
	}

	.stars {
		display: flex;
		gap: 5px;
	}

	.star {
		font-size: 30px;
		color: #ccc;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.star.selected {
		color: #ffa534;
	}

	.rating-value {
		margin-left: 15px;
		font-size: 16px;
		color: #555;
		font-weight: 500;
	}

	.radio-group {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 15px;
		margin-bottom: 25px;
	}

	.radio-option {
		position: relative;
	}

	.radio-option input[type='radio'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.radio-option label {
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: 17px;
		color: #333;
		transition: all 0.2s ease;
	}

	.radio-custom {
		display: inline-block;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid #ccc;
		margin-right: 10px;
		position: relative;
		transition: all 0.2s ease;
	}

	.radio-custom::before {
		content: '';
		display: block;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		background-color: #c21807;
		transition: transform 0.2s ease;
	}

	.radio-option input[type='radio']:checked + label .radio-custom {
		border-color: #c21807;
	}

	.radio-option input[type='radio']:checked + label .radio-custom::before {
		transform: translate(-50%, -50%) scale(1);
	}

	.radio-option input[type='radio']:focus + label .radio-custom {
		box-shadow: 0 0 0 3px rgba(194, 24, 7, 0.15);
	}

	.radio-option:hover label .radio-custom {
		border-color: #c21807;
	}

	.radio-label {
		font-family: 'Mulish', sans-serif;
		font-weight: 500;
	}

	.next-button {
		background-color: #c21807;
		color: white;
		border: none;
		border-radius: 10px;
		padding: 8px 17px;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 10px;
	}
	.next-button:hover {
		background-color: #a01505;
	}

	.submit-button {
		background-color: #c21807;
		color: white;
		border: none;
		border-radius: 10px;
		padding: 10px 20px;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 25px;
		cursor: pointer;
		transition: background-color 0.2s;
		margin: 10px auto;
		display: block;
	}
	.submit-button:hover {
		background-color: #a01505;
	}
	.review-textbox {
		width: 100%;
		height: 100px;
		border-radius: 8px;
		border: 1px solid #ccc;
		padding: 20px;
		font-size: 18px;
		resize: none;
		margin-top: 15px;
		resize: vertical;
		overflow: auto;
	}

	@media (max-width: 768px) {
		.radio-group {
			flex-direction: column;
			gap: 12px;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
