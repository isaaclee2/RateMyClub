<!-- src/routes/auth/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let form;

	// Check for URL error parameters
	$: urlError = $page.url.searchParams.get('error');
	$: errorMessage = getErrorMessage(urlError);

	function getErrorMessage(error) {
		switch (error) {
			case 'invalid_domain':
				return 'Please use your @usc.edu Google account. Other email domains are not allowed.';
			case 'callback_error':
				return 'There was an error during sign in. Please try again.';
			default:
				return null;
		}
	}
</script>

<svelte:head>
	<title>USC Sign In</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<h1>🏫 USC Portal</h1>
		<p class="subtitle">Sign in with your USC Google account</p>

		<form method="post" action="?/google" use:enhance>
			<button type="submit" class="google-btn">
				<svg class="google-icon" viewBox="0 0 24 24">
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
				Continue with USC Google Account
			</button>
		</form>

		{#if form?.error || errorMessage}
			<div class="error">
				<p>{form?.error || errorMessage}</p>
			</div>
		{/if}

		<div class="info">
			<p>⚠️ You must use your @usc.edu Google account</p>
			<p>Other email domains will not be allowed</p>
		</div>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.auth-card {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 2rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		padding: 14px 20px;
		background: white;
		border: 2px solid #dadce0;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		color: #3c4043;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}

	.google-btn:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: #c8c9ca;
	}

	.google-icon {
		width: 20px;
		height: 20px;
	}

	.error {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 6px;
		color: #c33;
	}

	.info {
		margin-top: 2rem;
		padding: 1rem;
		background: #f8f9ff;
		border-radius: 6px;
		font-size: 0.9rem;
		color: #666;
	}

	.info p {
		margin: 0.25rem 0;
	}
</style>
