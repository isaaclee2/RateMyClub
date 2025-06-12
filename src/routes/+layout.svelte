<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let { supabase, session } = $derived(data);
	const user = $derived(data.session?.user);
	let showSignInPopup = $state(false);
	let showMobileMenu = $state(false);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		function handleKeydown(event) {
			if (event.key === 'Escape') {
				if (showSignInPopup) {
					closeSignInPopup();
				}
				if (showMobileMenu) {
					showMobileMenu = false;
				}
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			subscription.unsubscribe();
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function openSignInPopup() {
		showSignInPopup = true;
	}

	function closeSignInPopup() {
		showSignInPopup = false;
	}

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	function showComingSoon() {
		alert('Coming soon! For now, please email us at ratemyclubusc@gmail.com.');
	}
</script>

<header>
	<link href="https://fonts.googleapis.com/css?family=Mulish" rel="stylesheet" />

	<!-- Your original centered logo -->
	<a href="/">
		<h1 class="title">
			<div class="rate-my">RateMy</div>
			<div class="club">Club</div>
		</h1>
	</a>

	<!-- Desktop navigation (your original style) -->
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
			<!-- svelte-ignore event_directive_deprecated -->
			<button on:click={openSignInPopup} class="signin-btn">Sign In</button>
		{/if}
	</nav>

	<!-- Mobile menu button (only shows on mobile) -->
	<!-- svelte-ignore event_directive_deprecated -->
	<button class="mobile-menu-btn" on:click={toggleMobileMenu} aria-label="Toggle menu">
		<span class="hamburger"></span>
		<span class="hamburger"></span>
		<span class="hamburger"></span>
	</button>

	<!-- Mobile navigation dropdown -->
	{#if showMobileMenu}
		<nav class="mobile-nav">
			<!-- svelte-ignore event_directive_deprecated -->
			<a href="/about" class="mobile-nav-link" on:click={() => (showMobileMenu = false)}>About</a>
			<!-- svelte-ignore event_directive_deprecated -->
			<a href="/contact" class="mobile-nav-link" on:click={() => (showMobileMenu = false)}
				>Contact Us</a
			>
			{#if user}
				<form method="POST" action="/auth?/logout" class="mobile-signin-form">
					<button type="submit" class="mobile-signin-btn logout-btn">Log Out</button>
				</form>
			{:else}
				<!-- svelte-ignore event_directive_deprecated -->
				<button on:click={openSignInPopup} class="mobile-signin-btn">Sign In</button>
			{/if}
		</nav>
	{/if}
</header>

{@render children()}

{#if showSignInPopup}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div class="popup-overlay" on:click={closeSignInPopup}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore event_directive_deprecated -->
		<div class="popup-content" on:click|stopPropagation>
			<button class="close-btn" on:click={closeSignInPopup}>×</button>
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
				<li><a class="quick-link" href="/">Home</a></li>
				<li><a class="quick-link" href="/all-clubs">All Clubs</a></li>
				<li><a class="quick-link" href="/contact">Contact Us</a></li>
			</ul>
		</div>

		<div class="footer-section more-links">
			<h3>Resources</h3>
			<ul>
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore a11y_invalid_attribute -->
				<li><a class="quick-link" href="#" on:click|preventDefault={showComingSoon}>FAQ</a></li>
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore a11y_invalid_attribute -->
				<li>
					<a class="quick-link" href="#" on:click|preventDefault={showComingSoon}
						>Can't find your club?</a
					>
				</li>
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore a11y_invalid_attribute -->
				<li>
					<a class="quick-link" href="#" on:click|preventDefault={showComingSoon}>Submit Feedback</a
					>
				</li>
			</ul>
		</div>
	</div>

	<div class="footer-bottom">
		<div class="centered-links">
			<!-- svelte-ignore event_directive_deprecated -->
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="/terms">Terms & Conditions</a> •
			<!-- svelte-ignore event_directive_deprecated -->
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="/privacy">Privacy Policy</a> •
			<span>All Rights Reserved</span>
		</div>
	</div>
</footer>

<style>
	/* Your original header styles - kept exactly the same for desktop */
	header {
		background-color: white;
		height: 90px;
		padding: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Mulish';
		position: relative;
	}

	.title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 15%;
		display: flex;
		flex-direction: row;
		font-weight: 900;
		font-size: 40px;
		margin: 0;
	}

	.rate-my {
		color: #333;
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

	/* Mobile menu button - hidden on desktop */
	.mobile-menu-btn {
		display: none;
		flex-direction: column;
		background: none;
		border: none;
		cursor: pointer;
		position: absolute;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		padding: 10px;
		z-index: 101;
	}

	.hamburger {
		width: 25px;
		height: 3px;
		background-color: #333;
		margin: 3px 0;
		transition: 0.3s;
	}

	/* Mobile navigation */
	.mobile-nav {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		z-index: 100;
		display: none;
	}

	.mobile-nav-link {
		display: block;
		color: #333;
		text-decoration: none;
		font-weight: bold;
		font-size: 18px;
		padding: 15px 0;
		border-bottom: 1px solid #eee;
	}

	.mobile-nav-link:hover {
		color: #c21807;
	}

	.mobile-nav-link:last-child {
		border-bottom: none;
	}

	.mobile-signin-form {
		margin: 15px 0 0 0;
	}

	.mobile-signin-btn {
		width: 100%;
		background-color: #c21807;
		color: white;
		border: none;
		padding: 15px;
		border-radius: 6px;
		font-family: 'Mulish';
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
	}

	.mobile-signin-btn:hover {
		background-color: #a01506;
	}

	.mobile-signin-btn.logout-btn {
		background-color: #888;
	}

	.mobile-signin-btn.logout-btn:hover {
		background-color: #777;
	}

	/* Your original button styles */
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
		background-color: #888;
	}

	.logout-btn:hover {
		background-color: #777;
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

	.close-btn:hover {
		background-color: #f5f5f5;
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

	/* Your original footer styles */
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
		grid-template-columns: 1fr 1fr 1fr;
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

	.footer-logo .rate-my {
		color: rgb(54, 54, 54);
	}

	.footer-logo .club {
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
		color: #c21807;
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
		color: #c21807;
		text-decoration: underline;
	}

	/* Mobile responsive - only show mobile menu on small screens */
	@media (max-width: 768px) {
		.links {
			display: none; /* Hide desktop nav */
		}

		.mobile-menu-btn {
			display: flex; /* Show hamburger */
		}

		.mobile-nav {
			display: block; /* Show mobile nav when toggled */
		}

		.title {
			top: 50%;
			transform: translate(-50%, -50%); /* Perfect centering on mobile */
			font-size: clamp(28px, 8vw, 40px);
		}

		.footer-container {
			grid-template-columns: 1fr 1fr;
		}

		.brand {
			grid-column: span 2;
		}
	}

	@media (max-width: 640px) {
		.footer-container {
			grid-template-columns: 1fr;
		}

		.brand {
			grid-column: span 1;
		}

		.title {
			font-size: 24px;
		}
	}
	@media (max-width: 480px) {
		h3 {
			font-size: 12px;
		}
		.tagline {
			font-size: 12px;
		}
		.quick-link {
			font-size: 12px;
		}
	}
</style>
