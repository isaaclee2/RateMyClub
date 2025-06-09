<script>
	import { goto } from '$app/navigation';

	let { data } = $props();
	let searchValue = $state('');
	let showResults = $state(false);
	let searchResults = $state([]);

	// Get user session
	const user = $derived(data.session?.user);

	function createSlug(text) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	// Enhanced search function (placeholder for now)
	function handleSearch(event) {
		searchValue = event.target.value.trim();

		if (searchValue.length > 0) {
			showResults = true;
			// TODO: Add actual search logic here
			// For now, just show placeholder
			searchResults = [{ name: 'Search coming soon!', slug: '#' }];
		} else {
			showResults = false;
			searchResults = [];
		}
	}

	function handleBlur() {
		// Delay hiding to allow clicking on results
		setTimeout(() => {
			showResults = false;
		}, 200);
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && searchValue.trim()) {
			// Redirect to all-clubs page with search parameter
			goto(`/all-clubs?search=${encodeURIComponent(searchValue.trim())}`);
		}
	}

	function selectResult(slug) {
		if (slug !== '#') {
			goto(`/club/${slug}`);
		}
		showResults = false;
	}
</script>

<div class="container-1">
	<div class="cover">
		<img class="image" src="/img4.jpg" alt="USC Campus" />
		<div class="overlay"></div>
	</div>

	<div class="content">
		<h1 class="description">Rate and review clubs at USC</h1>

		<div class="search-bar-container">
			<input
				type="text"
				class="search-bar"
				placeholder="Search for a club"
				bind:value={searchValue}
				on:input={handleSearch}
				on:blur={handleBlur}
				on:keydown={handleKeydown}
			/>

			{#if showResults && searchResults.length > 0}
				<div class="search-results">
					{#each searchResults as result}
						<button class="search-result-item" on:click={() => selectResult(result.slug)}>
							{result.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="all-clubs">
			<a href="/all-clubs">Browse all clubs</a>
		</div>
	</div>
</div>

<style>
	.container-1 {
		position: relative;
		width: 100%;
		min-height: 450px;
	}

	.image {
		width: 100%;
		height: 450px;
		object-fit: cover;
		display: block;
	}

	.cover {
		position: relative;
		width: 100%;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		pointer-events: none;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		padding: 20px;
		box-sizing: border-box;
	}

	.description {
		color: white;
		font-size: clamp(20px, 4vw, 27px);
		font-weight: 900;
		font-family: 'Mulish', sans-serif;
		text-align: center;
		margin: 0 0 30px 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	.search-bar-container {
		position: relative;
		width: min(90%, 500px);
		margin-bottom: 20px;
	}

	.search-bar {
		width: 100%;
		padding: 15px 20px;
		border-radius: 10px;
		border: none;
		font-size: 16px;
		font-family: 'Mulish', sans-serif;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		outline: none;
		transition: box-shadow 0.3s ease;
	}

	.search-bar:focus {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border-radius: 10px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		max-height: 200px;
		overflow-y: auto;
		z-index: 10;
	}

	.search-result-item {
		width: 100%;
		padding: 12px 20px;
		border: none;
		background: white;
		text-align: left;
		cursor: pointer;
		font-family: 'Mulish', sans-serif;
		transition: background-color 0.2s ease;
	}

	.search-result-item:hover {
		background-color: #f5f5f5;
	}

	.search-result-item:first-child {
		border-radius: 10px 10px 0 0;
	}

	.search-result-item:last-child {
		border-radius: 0 0 10px 10px;
	}

	.all-clubs {
		text-align: center;
	}

	.all-clubs a {
		color: white;
		text-decoration: underline;
		font-family: 'Mulish', sans-serif;
		font-weight: bold;
		font-size: 17px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
		transition: color 0.3s ease;
	}

	.all-clubs a:hover {
		color: #87ceeb;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.image {
			height: 350px;
		}

		.description {
			font-size: 22px;
			margin-bottom: 25px;
		}

		.search-bar {
			padding: 12px 16px;
			font-size: 14px;
		}

		.all-clubs a {
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		.image {
			height: 300px;
		}

		.description {
			font-size: 18px;
			margin-bottom: 20px;
		}

		.content {
			padding: 15px;
		}
	}
</style>
