<script>
	import Fuse from 'fuse.js';

	let { data } = $props();
	let selectedCategory = $state('All Categories');
	let searchQuery = $state('');
	let filteredClubs = $state([]);

	let categories = [
		'All Categories',
		'Academic',
		'Campus Department',
		'Career',
		'Civic Engagement',
		'Club Sport',
		'Design Team',
		'Environmental/Sustainability',
		'Ethnic/Cultural',
		'Health & Wellness',
		'Media/Publications',
		'Political',
		'Pre-Professional',
		'Recreation',
		'Service',
		'Social',
		'Social Awareness',
		'Spiritual',
		'Visual & Performing Arts',
		'Viterbi Student Organization'
	];

	const fuseOptions = {
		keys: [
			{ name: 'name', weight: 0.7 }, // Higher weight for name matches
			{ name: 'mission', weight: 0.2 }, // Lower weight for mission matches
			{ name: 'categories', weight: 0.1 } // Lowest weight for category matches
		],
		threshold: 0.4, // 0 = exact match, 1 = match anything
		distance: 100, // How far to search for matches
		minMatchCharLength: 2, // Minimum character length for matches
		includeScore: true, // Include match score in results
		ignoreLocation: true, // Don't consider location of match in string
		findAllMatches: true // Find all matches, not just first one
	};

	function filterClubs() {
		if (!data || !data.clubs) {
			filteredClubs = [];
			return;
		}

		let categoryFiltered = data.clubs;
		if (selectedCategory !== 'All Categories') {
			categoryFiltered = data.clubs.filter((club) => {
				if (!club.categories) return false;

				if (Array.isArray(club.categories)) {
					return club.categories.includes(selectedCategory);
				}

				if (typeof club.categories === 'string') {
					const categoriesArray = club.categories.split(';').map((cat) => cat.trim());
					return categoriesArray.includes(selectedCategory);
				}

				return false;
			});
		}

		if (searchQuery.trim() === '') {
			filteredClubs = [...categoryFiltered].sort((a, b) => {
				const reviewCountDiff = (b.review_count || 0) - (a.review_count || 0);

				if (reviewCountDiff === 0) {
					return a.name.localeCompare(b.name);
				}

				return reviewCountDiff;
			});
		} else {
			const tempFuse = new Fuse(categoryFiltered, fuseOptions);
			const searchResults = tempFuse.search(searchQuery);

			filteredClubs = searchResults.map((result) => result.item);
		}
	}

	$effect(() => {
		if (data && data.clubs) {
			filterClubs();
		}
	});

	$effect(() => {
		filterClubs();
	});

	// Scroll to top functionality
	let showScrollButton = $state(false);
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			showScrollButton = window.scrollY > 500;
		});
	}
</script>

<div class="heading-container">
	<a href="/" class="back">← Back</a>
	<h1 class="heading">All Registered Student Organizations</h1>
</div>

<div class="search-bar-container">
	<input type="text" class="search-bar" placeholder="Search clubs" bind:value={searchQuery} />
	<select class="category-filter" bind:value={selectedCategory}>
		{#each categories as category}
			<option value={category}>{category}</option>
		{/each}
	</select>
</div>

<div class="clubs-container">
	{#if filteredClubs && filteredClubs.length > 0}
		<div class="clubs-grid">
			{#each filteredClubs as club}
				<a href={`/club/${club.slug}`} class="club-card">
					<img src={club.image} alt="No Logo :(" />
					<div class="club-info">
						<h3 class="club-name">{club.name}</h3>
						{#if club.categories}
							<div class="club-category">{club.categories}</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="no-results">
			<p>No clubs match your search criteria</p>
		</div>
	{/if}
</div>

{#if showScrollButton}
	<button class="back-to-top" onclick={scrollToTop}>↑</button>
{/if}

<style>
	.heading-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}
	.heading {
		font-size: 30px;
		font-weight: 600;
		text-decoration: underline;
		margin-bottom: 10px;
		margin-top: 20px;
		font-family: 'Mulish';
	}
	.back {
		margin-top: 40px;
		color: #c21807;
		position: absolute;
		left: 12%;
	}
	.back:hover {
		text-decoration: underline;
	}

	.search-bar-container {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: center;
		gap: 30px;
		margin-top: 20px;
	}

	.search-bar {
		width: 50%;
		padding: 10px;
		margin-bottom: 20px;
		border-radius: 10px;
		border: 1px solid #ccc;
		font-size: 16px;
	}
	.category-filter {
		padding: 10px;
		margin-bottom: 20px;
		border-radius: 10px;
		border: 1px solid #ccc;
		font-size: 16px;
		width: 30%;
		background-color: white;
	}

	/* Clubs display styling */
	.clubs-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.clubs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}

	.club-card {
		display: flex;
		align-items: center;
		background-color: white;
		border-radius: 12px;
		padding: 16px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid #eee;
		text-decoration: none;
		color: inherit;
	}

	.club-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		border-color: #ddd;
	}

	img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 16px;
		object-fit: cover;
	}

	.club-info {
		flex-grow: 1;
		overflow: hidden;
	}

	.club-name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin: 0 0 4px 0;
		padding: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.club-category {
		font-size: 14px;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.no-results {
		text-align: center;
		padding: 60px 20px;
		color: #666;
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.back-to-top {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 50px;
		height: 50px;
		border-radius: 40%;
		background-color: #c21807;
		color: white;
		font-size: 24px;
		border: none;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
		z-index: 1000;
	}

	.back-to-top:hover {
		background-color: #a01400;
		transform: translateY(-3px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	}
	/* Mobile responsive styles - add to your existing CSS */

	/* Tablet styles */
	@media (max-width: 768px) {
		.heading-container {
			flex-direction: column;
			align-items: center;
			margin-top: 5px;
		}

		.back {
			position: static; /* Remove absolute positioning */
			margin-top: 0;
			margin-bottom: 10px;
			align-self: flex-start;
			margin-left: 20px;
			font-size: 16px;
		}

		.heading {
			font-size: 24px;
			margin-top: 10px;
			margin-bottom: 5px;
			text-align: center;
			padding: 0 20px;
		}

		.search-bar-container {
			flex-direction: column;
			align-items: center;
			gap: 15px;
			padding: 0 20px;
		}

		.search-bar {
			width: 100%;
			max-width: 400px;
		}

		.category-filter {
			width: 100%;
			max-width: 400px;
		}

		.clubs-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 15px;
		}

		.club-card {
			padding: 14px;
		}

		.club-name {
			font-size: 15px;
		}

		.club-category {
			font-size: 13px;
		}
	}

	/* Mobile styles */
	@media (max-width: 480px) {
		.heading {
			font-size: 20px;
			padding: 0 15px;
		}

		.back {
			margin-left: 15px;
			font-size: 14px;
		}

		.search-bar-container {
			padding: 0 15px;
			gap: 12px;
		}

		.clubs-container {
			padding: 0 15px;
			width: 100%;
			box-sizing: border-box;
			overflow-x: hidden;
		}

		.clubs-grid {
			grid-template-columns: 1fr; /* Single column on small screens */
			gap: 12px;
			width: 100%;
			box-sizing: border-box;
		}

		.club-card {
			padding: 12px;
			width: 100%;
			box-sizing: border-box;
			min-width: 0;
		}

		.club-name,
		.club-category {
			min-width: 0;
		}

		img {
			width: 35px;
			height: 35px;
			margin-right: 12px;
		}

		.club-name {
			font-size: 14px;
		}

		.club-category {
			font-size: 12px;
		}

		.back-to-top {
			width: 45px;
			height: 45px;
			bottom: 20px;
			right: 20px;
			font-size: 20px;
		}

		.no-results {
			padding: 40px 15px;
			font-size: 14px;
		}
	}

	/* Very small screens */
	@media (max-width: 360px) {
		.heading {
			font-size: 18px;
		}

		.search-bar,
		.category-filter {
			font-size: 14px;
			padding: 8px;
		}

		.club-card {
			padding: 10px;
		}

		.club-name {
			font-size: 13px;
		}

		.club-category {
			font-size: 11px;
		}
	}
</style>
