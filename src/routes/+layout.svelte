<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let { supabase, session } = $derived(data);
	const user = $derived(data.session?.user);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		function handleKeydown(event) {
			if (event.key === 'Escape' && showSignInPopup) {
				closeSignInPopup();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => subscription.unsubscribe();
	});
	let showSignInPopup = $state(false);
	function openSignInPopup() {
		showSignInPopup = true;
	}
	function closeSignInPopup() {
		showSignInPopup = false;
	}
	function handleGoogleSignIn() {
		closeSignInPopup();
	}
</script>

<header>
	<link href="https://fonts.googleapis.com/css?family=Mulish" rel="stylesheet" />
	<a href="/">
		<h1 class="title">
			<div class="rate-my">RateMy</div>
			<div class="club">Club</div>
		</h1>
	</a>
	<nav class="links">
		<a href="/about">
			<h2 class="about">About</h2>
		</a>
		<a href="/contact">
			<h2 class="contact">Contact Us</h2>
		</a>
		{#if user}
			<form method="POST" action="/auth?/logout" class="signin-form">
				<button type="submit" class="signin-btn logout-btn">Log Out</button>
			</form>
		{:else}
			<button onclick={openSignInPopup} class="signin-btn">Sign In</button>
		{/if}
	</nav>
</header>

{@render children()}

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

<footer class="site-footer">
	<div class="footer-container">
		<div class="footer-section brand">
			<a href="/" class="footer-logo">
				<span class="rate-my">RateMy</span><span class="club">Club</span>
			</a>
			<p class="tagline">Find and rate the best student clubs on campus.</p>
			<p class="tagline">Go Trojans!</p>
		</div>

		<div class="footer-section links">
			<h3>Quick Links</h3>
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/all-clubs">All Clubs</a></li>
				<li><a href="/contact">Contact Us</a></li>
			</ul>
		</div>

		<div class="footer-section more-links">
			<h3>Resources</h3>
			<ul>
				<li><a href="/faq">FAQ</a></li>
				<li><a href="/add-club">Can't find your club?</a></li>
				<li><a href="/feedback">Submit Feedback</a></li>
			</ul>
		</div>
	</div>

	<div class="footer-bottom">
		<div class="centered-links">
			<a href="/terms">Terms & Conditions</a> •
			<a href="/privacy">Privacy Policy</a> •
			<span>All Rights Reserved</span>
		</div>
	</div>
</footer>

<style>
	header {
		background-color: white;
		height: 90px;
		padding: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Mulish';
	}
	.title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 1.8%;
		display: flex;
		flex-direction: row;
		font-weight: 900;
		font-size: 40px;
	}
	.club {
		color: #c21807;
	}
	.links {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: auto;
		gap: 30px;
		margin-right: 10px;
		font-weight: bold;
	}
	.about:hover {
		text-decoration: underline;
	}
	.contact:hover {
		text-decoration: underline;
	}

	/* Sign in button styles */
	.signin-form {
		margin: 0;
	}

	.signin-btn {
		background-color: #c21807;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 5px;
		font-family: 'Mulish';
		font-weight: bold;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.signin-btn:hover {
		background-color: #a01506;
	}

	.logout-btn {
		background-color: #666;
	}

	.logout-btn:hover {
		background-color: #555;
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

	.site-footer {
		background-color: #f7f7f7f6;
		color: rgb(54, 54, 54);
		font-family: 'Mulish', sans-serif;
		padding: 30px 0 10px;
		margin-top: 30px;
	}

	.footer-container {
		max-width: 1300px;
		margin: 0 auto;
		padding: 0 20px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr; /* Changed to 3 equal columns */
		gap: 30px;
	}

	.footer-section {
		display: block;
	}

	.footer-section h3 {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 15px;
		color: rgb(54, 54, 54);
		position: relative;
	}

	.footer-section h3:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -5px;
		width: 40px;
		height: 2px;
		background-color: #c21807;
	}

	.footer-logo {
		font-size: 28px;
		font-weight: 900;
		margin-bottom: 10px;
		display: inline-block;
		text-decoration: none;
	}

	.rate-my {
		color: rgb(54, 54, 54);
	}

	.club {
		color: #c21807;
	}

	.tagline {
		color: rgb(54, 54, 54);
		font-size: 14px;
		margin-top: 10px;
	}

	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: block;
	}

	.footer-section li {
		margin-bottom: 8px;
		display: block;
	}

	.footer-section a {
		color: rgb(54, 54, 54);
		text-decoration: none;
		transition: color 0.2s ease;
		font-size: 14px;
	}

	.footer-section a:hover {
		color: rgb(54, 54, 54);
		text-decoration: underline;
	}

	.footer-bottom {
		max-width: 1300px;
		margin: 20px auto 0;
		padding: 20px 20px 10px;
		border-top: 1px solid rgb(54, 54, 54);
		text-align: center;
		font-size: 14px;
		color: rgb(54, 54, 54);
	}

	.centered-links {
		display: inline-block;
	}

	.centered-links a {
		color: rgb(54, 54, 54);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.centered-links a:hover {
		color: rgb(54, 54, 54);
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.footer-container {
			grid-template-columns: 1fr 1fr;
		}

		.brand {
			grid-column: span 2; /* Make brand take full width on medium screens */
		}
	}

	@media (max-width: 640px) {
		.footer-container {
			grid-template-columns: 1fr;
		}

		.brand {
			grid-column: span 1; /* Reset on smallest screens */
		}
	}
</style>
