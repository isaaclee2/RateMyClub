<!-- admin/login +page.svelte  -->
<script>
	import { enhance } from '$app/forms';
	export let form;

	let isSubmitting = false;

	// Enhanced form submission with better error handling
	function debugEnhance() {
		return enhance(({ formElement, formData, action, cancel }) => {
			isSubmitting = true;

			return async ({ result, update }) => {
				console.log('Form result:', result);
				isSubmitting = false;

				if (result.type === 'failure') {
					console.error('Login failed:', result.data);
				} else if (result.type === 'redirect') {
					console.log('Login successful, redirecting...');
				}

				// Always call update to handle the result properly
				await update({ reset: false });
			};
		});
	}
</script>

<div class="login-container">
	<div class="login-box">
		<form method="POST" action="?/login" use:debugEnhance on:submit={handleSubmit}>
			<h1>Admin Login</h1>
			<div class="login-form">
				<input
					name="email"
					type="email"
					placeholder="Enter your email address"
					required
					autocomplete="email"
				/>
				<input
					name="password"
					type="password"
					placeholder="Enter admin password"
					required
					autocomplete="current-password"
				/>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Logging in...' : 'Login'}
				</button>
				{#if form?.error}
					<p class="error">{form.error}</p>
				{/if}
			</div>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		font-family: 'Mulish', sans-serif;
		margin-top: -70px;
	}

	.login-box {
		background: white;
		padding: 40px;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		text-align: center;
		min-width: 300px;
		max-width: 500px;
	}

	.login-box h1 {
		margin: 0 0 25px 0;
		color: #c21807;
		font-size: 24px;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.login-form input {
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 16px;
	}

	.login-form input:focus {
		outline: none;
		border-color: #c21807;
		box-shadow: 0 0 0 2px rgba(194, 24, 7, 0.1);
	}

	.login-form button {
		background-color: #c21807;
		color: white;
		border: none;
		padding: 12px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.login-form button:hover:not(:disabled) {
		background-color: #a01400;
	}

	.login-form button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		color: #dc3545;
		margin: 10px 0 0 0;
		font-size: 14px;
	}
</style>
