<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data;
	export let form;

	console.log('Admin page data:', data);
	console.log('Form data:', form);

	let activeTab = 'reviews';

	// Get data from server load function
	$: pendingReviews = data.pendingReviews || [];
	$: pendingClubUpdates = data.pendingClubUpdates || [];
	$: console.log('Pending reviews count:', pendingReviews.length);
	$: console.log('Pending club updates count:', pendingClubUpdates.length);

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStars(rating) {
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
	}

	// Enhanced form submission with loading states (only runs on client)
	function enhancedSubmit() {
		if (!browser) return enhance(); // Fallback for SSR

		return enhance(async ({ formElement }) => {
			// Add loading state to the button
			const button = formElement.querySelector('button[type="submit"]');
			const originalText = button.textContent;
			button.disabled = true;
			button.textContent = 'Processing...';

			return async ({ result, update }) => {
				// Re-enable button
				button.disabled = false;
				button.textContent = originalText;

				if (result.type === 'success') {
					// Show success message
					if (result.data?.message) {
						alert(result.data.message);
					}
					// Refresh the page data
					await invalidateAll();
				} else if (result.type === 'failure') {
					// Show error message
					alert(result.data?.error || 'An error occurred');
				}

				// Don't call update() to prevent form reset
			};
		});
	}

	function confirmRejectReview() {
		return confirm('Are you sure you want to reject this review? This will permanently delete it.');
	}

	function confirmClubUpdate() {
		return confirm(
			'Have you manually updated the club information in the database? This will mark the request as complete.'
		);
	}

	function confirmRejectClubUpdate() {
		return confirm(
			'Are you sure you want to reject this club update request? This will permanently delete it.'
		);
	}
</script>

<div class="admin-container">
	<div class="admin-header">
		<h1>Admin Dashboard</h1>
		<div class="header-actions">
			<div class="stats">
				<div class="stat-card">
					<span class="stat-number">{pendingReviews.length}</span>
					<span class="stat-label">Pending Reviews</span>
				</div>
				<div class="stat-card">
					<span class="stat-number">{pendingClubUpdates.length}</span>
					<span class="stat-label">Pending Updates</span>
				</div>
			</div>
			<form method="POST" action="?/logout" use:enhance>
				<button type="submit" class="logout-btn">Logout</button>
			</form>
		</div>
	</div>

	<!-- Display success/error messages -->
	{#if form?.message}
		<div class="alert alert-success">
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}

	<div class="tabs">
		<button
			class="tab {activeTab === 'reviews' ? 'active' : ''}"
			on:click={() => (activeTab = 'reviews')}
		>
			Pending Reviews ({pendingReviews.length})
		</button>
		<button
			class="tab {activeTab === 'updates' ? 'active' : ''}"
			on:click={() => (activeTab = 'updates')}
		>
			Club Updates ({pendingClubUpdates.length})
		</button>
	</div>

	{#if activeTab === 'reviews'}
		<div class="reviews-section">
			{#if pendingReviews.length === 0}
				<div class="empty-state">
					<h3>No pending reviews</h3>
					<p>All caught up! 🎉</p>
				</div>
			{:else}
				{#each pendingReviews as review}
					<div class="review-card">
						<div class="review-header">
							<div class="club-info">
								<h3>{review.club_slug}</h3>
								<span class="submitted-date">Submitted {formatDate(review.created_at)}</span>
							</div>
							<div class="user-info">
								<span class="user-email">{review.user_email}</span>
								<span class="connection">{review.connection} • {review.year_joined}</span>
							</div>
						</div>

						<div class="ratings-grid">
							<div class="rating-item">
								<span class="rating-label">Leadership:</span>
								<span class="rating-stars">{getStars(review.leadership_rating)}</span>
								<span class="rating-number">{review.leadership_rating}/5</span>
							</div>
							<div class="rating-item">
								<span class="rating-label">Inclusivity:</span>
								<span class="rating-stars">{getStars(review.inclusivity_rating)}</span>
								<span class="rating-number">{review.inclusivity_rating}/5</span>
							</div>
							<div class="rating-item">
								<span class="rating-label">Development:</span>
								<span class="rating-stars">{getStars(review.development_rating)}</span>
								<span class="rating-number">{review.development_rating}/5</span>
							</div>
							<div class="rating-item">
								<span class="rating-label">Social:</span>
								<span class="rating-stars">{getStars(review.social_rating)}</span>
								<span class="rating-number">{review.social_rating}/5</span>
							</div>
							<div class="rating-item overall">
								<span class="rating-label">Overall vibes:</span>
								<span class="rating-stars">{getStars(review.overall_rating)}</span>
								<span class="rating-number">{review.overall_rating}/5</span>
							</div>
						</div>

						<div class="club-estimates">
							<span class="estimate"><strong>Size:</strong> {review.members_estimate}</span>
							<span class="estimate"
								><strong>Selectivity:</strong> {review.selectivity_estimate}</span
							>
						</div>

						{#if review.review_text}
							<div class="review-text">
								<h4>Review Text:</h4>
								<p>"{review.review_text}"</p>
							</div>
						{/if}

						<div class="review-actions">
							<form method="POST" action="?/approveReview" use:enhancedSubmit>
								<input type="hidden" name="reviewId" value={review.id} />
								<button type="submit" class="approve-btn">✓ Approve</button>
							</form>

							<form
								method="POST"
								action="?/rejectReview"
								use:enhancedSubmit
								on:submit|preventDefault={(e) => {
									if (confirmRejectReview()) {
										e.target.submit();
									}
								}}
							>
								<input type="hidden" name="reviewId" value={review.id} />
								<button type="submit" class="reject-btn">✗ Reject</button>
							</form>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="updates-section">
			{#if pendingClubUpdates.length === 0}
				<div class="empty-state">
					<h3>No pending club updates</h3>
					<p>All caught up! 🎉</p>
				</div>
			{:else}
				{#each pendingClubUpdates as update}
					<div class="update-card">
						<div class="update-header">
							<div class="club-info">
								<h3>{update.club_name}</h3>
								<span class="club-slug">/{update.club_slug}</span>
								<span class="submitted-date">Submitted {formatDate(update.created_at)}</span>
							</div>
							<div class="submitter-info">
								<span class="submitter-name">{update.submitter_name}</span>
								<span class="submitter-email">{update.submitter_email}</span>
								<span class="submitter-year">{update.submitter_year}</span>
							</div>
						</div>

						<div class="proof-section">
							<h4>Proof of Membership:</h4>
							<p class="proof-text">"{update.proof_of_membership}"</p>
						</div>

						<div class="updates-grid">
							{#if update.requested_mission}
								<div class="update-item">
									<h4>Mission Statement Update:</h4>
									<p class="update-text">"{update.requested_mission}"</p>
								</div>
							{/if}

							{#if update.requested_categories}
								<div class="update-item">
									<h4>Categories Update:</h4>
									<p class="update-text">{update.requested_categories}</p>
								</div>
							{/if}

							{#if update.requested_website}
								<div class="update-item">
									<h4>Website Update:</h4>
									<p class="update-text">
										<a href={update.requested_website} target="_blank" rel="noopener noreferrer">
											{update.requested_website}
										</a>
									</p>
								</div>
							{/if}
						</div>

						<div class="database-note">
							<p>
								<strong>Instructions:</strong> Manually update the club information in the Supabase database,
								then click "Confirm" below.
							</p>
						</div>

						<div class="update-actions">
							<form
								method="POST"
								action="?/confirmClubUpdate"
								use:enhancedSubmit
								on:submit|preventDefault={(e) => {
									if (confirmClubUpdate()) {
										e.target.submit();
									}
								}}
							>
								<input type="hidden" name="updateId" value={update.id} />
								<button type="submit" class="confirm-btn">✓ Confirm (I updated the database)</button
								>
							</form>

							<form
								method="POST"
								action="?/rejectClubUpdate"
								use:enhancedSubmit
								on:submit|preventDefault={(e) => {
									if (confirmRejectClubUpdate()) {
										e.target.submit();
									}
								}}
							>
								<input type="hidden" name="updateId" value={update.id} />
								<button type="submit" class="reject-btn">✗ Reject</button>
							</form>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Keep all your existing styles and add these new alert styles */
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: 'Mulish', sans-serif;
	}

	.alert {
		padding: 12px 16px;
		margin-bottom: 20px;
		border-radius: 6px;
		font-weight: 500;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		padding-bottom: 20px;
		border-bottom: 2px solid #eee;
	}

	.admin-header h1 {
		color: #c21807;
		margin: 0;
		font-size: 32px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.stats {
		display: flex;
		gap: 20px;
	}

	.stat-card {
		background: white;
		padding: 15px 25px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		min-width: 120px;
	}

	.stat-number {
		display: block;
		font-size: 24px;
		font-weight: 700;
		color: #c21807;
	}

	.stat-label {
		display: block;
		font-size: 12px;
		color: #666;
		margin-top: 4px;
	}

	.logout-btn {
		background-color: #6c757d;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.logout-btn:hover {
		background-color: #5a6268;
	}

	.tabs {
		display: flex;
		margin-bottom: 25px;
		border-bottom: 1px solid #eee;
	}

	.tab {
		padding: 12px 20px;
		border: none;
		background: none;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		border-bottom: 3px solid transparent;
		transition: all 0.2s;
		color: #666;
	}

	.tab.active {
		color: #c21807;
		border-bottom-color: #c21807;
	}

	.tab:hover {
		color: #c21807;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: #666;
	}

	.empty-state h3 {
		margin: 0 0 10px 0;
		font-size: 20px;
	}

	/* Review Card Styles */
	.review-card {
		background: white;
		border-radius: 12px;
		padding: 25px;
		margin-bottom: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		border: 1px solid #eee;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.club-info h3 {
		margin: 0 0 5px 0;
		color: #c21807;
		font-size: 18px;
		font-weight: 700;
	}

	.submitted-date {
		font-size: 12px;
		color: #888;
	}

	.user-info {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.user-email {
		font-weight: 600;
		color: #333;
		font-size: 14px;
	}

	.connection {
		font-size: 12px;
		color: #666;
	}

	.ratings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
		margin-bottom: 15px;
	}

	.rating-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background-color: #f8f9fa;
		border-radius: 6px;
	}

	.rating-item.overall {
		background-color: #f8f9fa;
		font-weight: 600;
	}

	.rating-label {
		font-size: 13px;
		color: #555;
		min-width: 80px;
	}

	.rating-stars {
		color: #ffa534;
		font-size: 14px;
	}

	.rating-number {
		font-size: 12px;
		color: #666;
		font-weight: 600;
	}

	.club-estimates {
		display: flex;
		gap: 25px;
		margin-bottom: 15px;
		font-size: 14px;
	}

	.estimate {
		color: #666;
	}

	.review-text {
		margin-bottom: 20px;
		padding: 15px;
		background-color: #f8f9fa;
		border-radius: 8px;
		border-left: 3px solid #c21807;
	}

	.review-text h4 {
		margin: 0 0 8px 0;
		color: #333;
		font-size: 14px;
	}

	.review-text p {
		margin: 0;
		line-height: 1.5;
		color: #555;
		font-style: italic;
	}

	.review-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.approve-btn,
	.reject-btn,
	.confirm-btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;
	}

	.approve-btn,
	.confirm-btn {
		background-color: #28a745;
		color: white;
	}

	.approve-btn:hover,
	.confirm-btn:hover {
		background-color: #218838;
		transform: translateY(-1px);
	}

	.reject-btn {
		background-color: #dc3545;
		color: white;
	}

	.reject-btn:hover {
		background-color: #c82333;
		transform: translateY(-1px);
	}

	.approve-btn:disabled,
	.reject-btn:disabled,
	.confirm-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	/* Club Update Card Styles */
	.update-card {
		background: white;
		border-radius: 12px;
		padding: 25px;
		margin-bottom: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		border: 1px solid #eee;
	}

	.update-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.club-slug {
		font-size: 12px;
		color: #888;
		font-family: monospace;
		background-color: #f8f9fa;
		padding: 2px 6px;
		border-radius: 4px;
		margin-right: 10px;
	}

	.submitter-info {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.submitter-name {
		font-weight: 600;
		color: #333;
		font-size: 14px;
	}

	.submitter-email {
		font-size: 12px;
		color: #666;
	}

	.submitter-year {
		font-size: 12px;
		color: #666;
		text-transform: capitalize;
	}

	.proof-section {
		margin-bottom: 20px;
		padding: 15px;
		background-color: #fff8e1;
		border-radius: 8px;
		border-left: 3px solid #ffa000;
	}

	.proof-section h4 {
		margin: 0 0 8px 0;
		color: #333;
		font-size: 14px;
	}

	.proof-text {
		margin: 0;
		line-height: 1.5;
		color: #555;
		font-style: italic;
	}

	.updates-grid {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 20px;
	}

	.update-item {
		padding: 15px;
		background-color: #f8f9fa;
		border-radius: 8px;
		border-left: 3px solid #c21807;
	}

	.update-item h4 {
		margin: 0 0 8px 0;
		color: #333;
		font-size: 14px;
	}

	.update-text {
		margin: 0;
		line-height: 1.5;
		color: #555;
	}

	.update-text a {
		color: #c21807;
		text-decoration: none;
	}

	.update-text a:hover {
		text-decoration: underline;
	}

	.database-note {
		margin-bottom: 20px;
		padding: 12px 15px;
		background-color: #e3f2fd;
		border-radius: 8px;
		border-left: 3px solid #2196f3;
	}

	.database-note p {
		margin: 0;
		color: #1565c0;
		font-size: 14px;
		font-weight: 500;
	}

	.update-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.admin-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 15px;
		}

		.header-actions {
			align-self: stretch;
			justify-content: space-between;
		}

		.stats {
			align-self: stretch;
			justify-content: space-around;
		}

		.review-header,
		.update-header {
			flex-direction: column;
			gap: 10px;
		}

		.user-info,
		.submitter-info {
			text-align: left;
		}

		.ratings-grid {
			grid-template-columns: 1fr;
		}

		.club-estimates {
			flex-direction: column;
			gap: 8px;
		}

		.review-actions,
		.update-actions {
			justify-content: stretch;
		}

		.approve-btn,
		.reject-btn,
		.confirm-btn {
			flex: 1;
		}
	}
</style>
