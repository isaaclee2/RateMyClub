<script>
	import { supabase } from '$lib/supabaseClient';
	let { children, data } = $props();
	const user = $derived(data.session?.user);

	let formData = $state({
		name: '',
		email: '',
		year: '',
		proofOfMembership: '',
		mission: '',
		categories: '',
		website: ''
	});

	let submitMessage = $state('');
	let submitError = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		submitMessage = '';
		submitError = '';

		try {
			if (!formData.name || !formData.email || !formData.year || !formData.proofOfMembership) {
				throw new Error('Please fill in all required personal information fields');
			}

			if (!formData.mission && !formData.categories && !formData.website) {
				throw new Error('Please provide at least one update.');
			}

			const { error: insertError } = await supabase.from('pending_club_updates').insert({
				club_id: data.club.id,
				club_slug: data.club.slug,
				club_name: data.club.name,
				submitter_name: formData.name,
				submitter_email: formData.email,
				submitter_year: formData.year,
				proof_of_membership: formData.proofOfMembership,
				requested_mission: formData.mission || null,
				requested_categories: formData.categories || null,
				requested_website: formData.website || null
			});

			if (insertError) {
				throw new Error(insertError.message);
			}

			submitMessage = 'Update request submitted successfully! We will review your changes.';

			// Reset form
			formData = {
				name: '',
				email: '',
				year: '',
				proofOfMembership: '',
				mission: '',
				categories: '',
				website: ''
			};
		} catch (error) {
			console.error('Submission error:', error);
			submitError = error.message;
		}
	}
</script>

{#if user}
	<div class="update-container">
		<div class="header-section">
			<a href="/club/{data.club.slug}" class="back-link">
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
					<path d="M19 12H5m7-7-7 7 7 7" />
				</svg>
				Back to {data.club.name}
			</a>
			<h1>Update Club Information Request</h1>
			<p class="subtitle">Submit update requests for <strong>{data.club.name}</strong></p>
		</div>

		<form on:submit={handleSubmit} class="update-form">
			<!-- Personal Information Section -->
			<section class="form-section">
				<h2>Your Information</h2>
				<p class="section-description">
					We need to verify you're authorized to update this club's information.
				</p>
				<div class="form-group">
					<label for="name">Full Name *</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						required
						placeholder="Enter your full name"
					/>
				</div>
				<div class="form-group">
					<label for="email">Email Address *</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						required
						placeholder="Enter your email address"
					/>
					<small class="field-help">We'll use this to contact you about your update request</small>
				</div>

				<div class="form-group">
					<label for="year">Year/Status *</label>
					<select id="year" bind:value={formData.year} required>
						<option value="">Select your year</option>
						<option value="freshman">Freshman</option>
						<option value="sophomore">Sophomore</option>
						<option value="junior">Junior</option>
						<option value="senior">Senior</option>
						<option value="graduate">Graduate Student</option>
						<option value="phd">PhD Student</option>
						<option value="faculty">Faculty</option>
						<option value="staff">Staff</option>
					</select>
				</div>

				<div class="form-group">
					<label for="proofOfMembership">Proof of Board Membership *</label>
					<textarea
						id="proofOfMembership"
						bind:value={formData.proofOfMembership}
						required
						placeholder="Please provide information on where we can verify your board membership (e.g., club website officer page, club social media, club constitution, contact information for faculty advisor, etc.)"
						rows="4"
					></textarea>
					<small class="field-help"
						>Examples: Link to club website with officer list, Instagram handle showing your role,
						faculty advisor contact, etc.</small
					>
				</div>
			</section>

			<!-- Club Information Section -->
			<section class="form-section">
				<h2>Club Information Updates</h2>
				<p class="section-description">
					Provide the updated information below. Only fill in fields that need to be changed.
				</p>

				<div class="current-info">
					<h3>Current Information:</h3>
					<div class="current-field">
						<strong>Mission:</strong>
						<p>{data.club.mission || 'Not set'}</p>
					</div>
					<div class="current-field">
						<strong>Categories:</strong>
						<p>{data.club.categories || 'Not set'}</p>
					</div>
					<div class="current-field">
						<strong>Website:</strong>
						<p>{data.club.website || 'Not set'}</p>
					</div>
				</div>

				<div class="form-group">
					<label for="mission">New Mission Statement</label>
					<textarea
						id="mission"
						bind:value={formData.mission}
						placeholder="Enter the updated mission statement (leave blank if no change)"
						rows="4"
					></textarea>
				</div>

				<div class="form-group">
					<label for="categories">New Categories</label>
					<input
						type="text"
						id="categories"
						bind:value={formData.categories}
						placeholder="e.g., Academic, Professional, Social, Cultural (leave blank if no change)"
					/>
					<small class="field-help">Separate multiple categories with commas</small>
				</div>

				<div class="form-group">
					<label for="website">New Website URL</label>
					<input
						type="url"
						id="website"
						bind:value={formData.website}
						placeholder="https://example.com (leave blank if no change)"
					/>
				</div>
			</section>

			<!-- Submit Section -->
			<section class="submit-section">
				{#if submitMessage}
					<div class="success-message">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							width="20"
							height="20"
							stroke-width="2"
						>
							<path d="M9 12l2 2 4-4" />
							<circle cx="12" cy="12" r="10" />
						</svg>
						{submitMessage}
					</div>
				{/if}

				{#if submitError}
					<div class="error-message">
						{submitError}
					</div>
				{/if}

				<button type="submit" class="submit-button"> Submit Update Request </button>

				<p class="submit-note">
					<strong>Note:</strong> Your update request will be reviewed by our team. We may contact you
					if we need additional verification.
				</p>
			</section>
		</form>
	</div>
{:else}
	<div class="access-denied">
		<h1>Access Denied</h1>
		<p>You must be signed in to update club information.</p>
		<a href="/club/{data.club.slug}" class="back-button">
			← Back to {data.club.name}
		</a>
	</div>
{/if}

<style>
	.update-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: 'Mulish', sans-serif;
	}

	.header-section {
		margin-bottom: 40px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #c21807;
		text-decoration: none;
		font-size: 14px;
		margin-bottom: 20px;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: #a01400;
		text-decoration: underline;
	}

	.back-link svg {
		flex-shrink: 0;
	}

	h1 {
		font-size: 32px;
		font-weight: 700;
		color: #333;
		margin: 0 0 10px 0;
	}

	.subtitle {
		color: #666;
		font-size: 16px;
		margin: 0;
	}

	.update-form {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.form-section {
		background-color: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 30px;
	}

	.form-section h2 {
		font-size: 20px;
		font-weight: 700;
		color: #c21807;
		margin: 0 0 8px 0;
	}

	.section-description {
		color: #666;
		font-size: 14px;
		margin: 0 0 25px 0;
		line-height: 1.5;
	}

	.current-info {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 25px;
	}

	.current-info h3 {
		margin: 0 0 15px 0;
		color: #495057;
		font-size: 16px;
	}

	.current-field {
		margin-bottom: 10px;
		font-size: 14px;
		line-height: 1.4;
	}

	.current-field strong {
		color: #c21807;
		display: inline-block;
		min-width: 80px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-weight: 600;
		color: #333;
		margin-bottom: 6px;
		font-size: 14px;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 12px;
		border: 1px solid #d0d0d0;
		border-radius: 8px;
		font-size: 14px;
		font-family: 'Mulish', sans-serif;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #c21807;
		box-shadow: 0 0 0 3px rgba(194, 24, 7, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.field-help {
		display: block;
		margin-top: 4px;
		color: #888;
		font-size: 12px;
		line-height: 1.4;
	}

	.submit-section {
		text-align: center;
	}

	.success-message {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #e8f5e9;
		color: #2e7d32;
		padding: 12px 20px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		font-weight: 500;
	}

	.error-message {
		background-color: #ffebee;
		color: #c62828;
		padding: 12px 20px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		font-weight: 500;
	}

	.submit-button {
		background-color: #c21807;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: 'Mulish', sans-serif;
	}

	.submit-button:hover {
		background-color: #a01400;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(194, 24, 7, 0.3);
	}

	.submit-note {
		margin-top: 15px;
		color: #666;
		font-size: 13px;
		line-height: 1.5;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.access-denied {
		max-width: 600px;
		margin: 100px auto;
		text-align: center;
		padding: 40px;
		background-color: #f9f9f9;
		border-radius: 12px;
		border: 1px solid #e0e0e0;
	}

	.access-denied h1 {
		color: #c21807;
		margin-bottom: 15px;
	}

	.access-denied p {
		color: #666;
		margin-bottom: 25px;
		font-size: 16px;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		background-color: #c21807;
		color: white;
		text-decoration: none;
		padding: 12px 20px;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.back-button:hover {
		background-color: #a01400;
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		.update-container {
			padding: 15px;
		}

		.form-section {
			padding: 20px;
		}

		h1 {
			font-size: 24px;
		}
	}
</style>
