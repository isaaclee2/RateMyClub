<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { supabase } from '$lib/supabaseClient';

	let pendingReviews = [];
	let pendingClubUpdates = [];
	let activeTab = 'reviews';
	let loading = true;

	onMount(() => {
		loadData();
	});

	// Remove the form success watcher since login is on separate page

	async function loadData() {
		loading = true;
		try {
			// Load pending reviews
			const { data: reviews, error: reviewError } = await supabase
				.from('pending_reviews')
				.select('*')
				.order('created_at', { ascending: false });

			if (reviewError) throw reviewError;
			pendingReviews = reviews || [];

			// Load pending club updates (if you have that table)
			const { data: updates, error: updateError } = await supabase
				.from('pending_club_updates')
				.select('*')
				.order('created_at', { ascending: false });

			if (!updateError) {
				pendingClubUpdates = updates || [];
			}
		} catch (error) {
			console.error('Error loading data:', error);
		}
		loading = false;
	}

	async function approveReview(reviewId) {
		try {
			// Get the review data
			const { data: review, error: fetchError } = await supabase
				.from('pending_reviews')
				.select('*')
				.eq('id', reviewId)
				.single();

			if (fetchError) throw fetchError;

			// Insert only the columns that exist in both tables
			const { error: insertError } = await supabase.from('reviews').insert([
				{
					club_id: review.club_id,
					club_slug: review.club_slug,
					user_email: review.user_email,
					connection: review.connection,
					year_joined: review.year_joined,
					leadership_rating: review.leadership_rating,
					inclusivity_rating: review.inclusivity_rating,
					development_rating: review.development_rating,
					social_rating: review.social_rating,
					overall_rating: review.overall_rating,
					members_estimate: review.members_estimate,
					selectivity_estimate: review.selectivity_estimate,
					review_text: review.review_text,
					approved_at: new Date().toISOString()
				}
			]);

			if (insertError) throw insertError;

			// Delete from pending
			const { error: deleteError } = await supabase
				.from('pending_reviews')
				.delete()
				.eq('id', reviewId);

			if (deleteError) throw deleteError;

			await recalculateClubStats(review.club_id);

			// Reload data
			loadData();
			alert('Review approved successfully!');
		} catch (error) {
			console.error('Error approving review:', error);
			alert('Error approving review: ' + error.message);
		}
	}

	async function recalculateClubStats(clubId) {
		try {
			// Get all approved reviews for this club
			const { data: reviews, error: reviewsError } = await supabase
				.from('reviews')
				.select(
					'leadership_rating, inclusivity_rating, development_rating, social_rating, overall_rating'
				)
				.eq('club_id', clubId);

			if (reviewsError) throw reviewsError;

			if (reviews.length === 0) return;

			// Calculate averages for each category
			const totals = reviews.reduce(
				(acc, review) => {
					acc.leadership += review.leadership_rating;
					acc.inclusivity += review.inclusivity_rating;
					acc.development += review.development_rating;
					acc.social += review.social_rating;
					acc.overall += review.overall_rating;
					return acc;
				},
				{
					leadership: 0,
					inclusivity: 0,
					development: 0,
					social: 0,
					overall: 0
				}
			);

			const count = reviews.length;
			const averages = {
				leadership_rating: Number((totals.leadership / count).toFixed(1)),
				inclusivity_rating: Number((totals.inclusivity / count).toFixed(1)),
				development_rating: Number((totals.development / count).toFixed(1)),
				social_rating: Number((totals.social / count).toFixed(1)),
				overall_vibes_rating: Number((totals.overall / count).toFixed(1))
			};

			// Calculate the club's overall rating as average of all 5 categories
			const overallRating = Number(
				(
					(averages.leadership_rating +
						averages.inclusivity_rating +
						averages.development_rating +
						averages.social_rating +
						averages.overall_vibes_rating) /
					5
				).toFixed(1)
			);

			// Update the club's stats
			const { error: updateError } = await supabase
				.from('clubs')
				.update({
					leadership_rating: averages.leadership_rating,
					inclusivity_rating: averages.inclusivity_rating,
					development_rating: averages.development_rating,
					social_rating: averages.social_rating,
					overall_vibes_rating: averages.overall_vibes_rating,
					overall_rating: overallRating,
					review_count: count
				})
				.eq('id', clubId);

			if (updateError) throw updateError;

			console.log(`Updated club ${clubId} stats:`, {
				...averages,
				overall_rating: overallRating,
				review_count: count
			});
		} catch (error) {
			console.error('Error recalculating club stats:', error);
			throw error; // Re-throw so approval process knows there was an issue
		}
	}

	async function rejectReview(reviewId) {
		if (!confirm('Are you sure you want to reject this review? This will permanently delete it.')) {
			return;
		}

		try {
			const { error } = await supabase.from('pending_reviews').delete().eq('id', reviewId);

			if (error) throw error;

			loadData();
			alert('Review rejected and deleted.');
		} catch (error) {
			console.error('Error rejecting review:', error);
			alert('Error rejecting review');
		}
	}

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

	async function confirmClubUpdate(updateId) {
		if (
			!confirm(
				'Have you manually updated the club information in the database? This will mark the request as complete.'
			)
		) {
			return;
		}

		try {
			const { error } = await supabase.from('pending_club_updates').delete().eq('id', updateId);

			if (error) throw error;

			loadData(); // Reload all data
			alert('Club update request marked as complete!');
		} catch (error) {
			console.error('Error confirming club update:', error);
			alert('Error confirming update: ' + error.message);
		}
	}
	async function rejectClubUpdate(updateId) {
		if (
			!confirm(
				'Are you sure you want to reject this club update request? This will permanently delete it.'
			)
		) {
			return;
		}

		try {
			const { error } = await supabase.from('pending_club_updates').delete().eq('id', updateId);

			if (error) throw error;

			loadData();
			alert('Club update request rejected and deleted.');
		} catch (error) {
			console.error('Error rejecting club update:', error);
			alert('Error rejecting update');
		}
	}
</script>

<!-- Remove the login form section and just show admin dashboard -->
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

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if activeTab === 'reviews'}
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
							<button class="approve-btn" on:click={() => approveReview(review.id)}>
								✓ Approve
							</button>
							<button class="reject-btn" on:click={() => rejectReview(review.id)}>
								✗ Reject
							</button>
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
							<button class="confirm-btn" on:click={() => confirmClubUpdate(update.id)}>
								✓ Confirm (I updated the database)
							</button>
							<button class="reject-btn" on:click={() => rejectClubUpdate(update.id)}>
								✗ Reject
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Keep all your existing admin dashboard styles, but remove login-related styles */
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: 'Mulish', sans-serif;
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

	.loading {
		text-align: center;
		padding: 40px;
		font-size: 18px;
		color: #666;
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
	.reject-btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;
	}

	.approve-btn {
		background-color: #28a745;
		color: white;
	}

	.approve-btn:hover {
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
	/* Club Update Card Styles - Add to your existing admin page CSS */

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

	.club-info h3 {
		margin: 0 0 5px 0;
		color: #c21807;
		font-size: 18px;
		font-weight: 700;
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

	.submitted-date {
		font-size: 12px;
		color: #888;
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

	.confirm-btn,
	.reject-btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;
	}

	.confirm-btn {
		background-color: #28a745;
		color: white;
	}

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

	@media (max-width: 768px) {
		.update-header {
			flex-direction: column;
			gap: 10px;
		}

		.submitter-info {
			text-align: left;
		}

		.update-actions {
			justify-content: stretch;
		}

		.confirm-btn,
		.reject-btn {
			flex: 1;
		}
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

		.review-header {
			flex-direction: column;
			gap: 10px;
		}

		.user-info {
			text-align: left;
		}

		.ratings-grid {
			grid-template-columns: 1fr;
		}

		.club-estimates {
			flex-direction: column;
			gap: 8px;
		}

		.review-actions {
			justify-content: stretch;
		}

		.approve-btn,
		.reject-btn {
			flex: 1;
		}
	}
</style>
