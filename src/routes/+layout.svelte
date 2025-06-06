<script>
	import '../app.css';
	let { children, data } = $props();
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { supabase, session } = $derived(data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

{@render children()}

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
	}

	.footer-section li {
		margin-bottom: 8px;
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
