<script>
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
	function createSlug(text) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	function fuzzySearch(needle, haystack) {
		if (!haystack) return { matched: false, quality: Infinity };

		const needleLower = needle.toLowerCase();
		const haystackLower = haystack.toLowerCase();

		if (haystackLower.includes(needleLower)) {
			const position = haystackLower.indexOf(needleLower);
			return {
				matched: true,
				quality: position * 0.1
			};
		}

		const words = haystack.split(/\s+/);
		const acronym = words
			.map((word) => word[0] || '')
			.join('')
			.toLowerCase();
		if (acronym.includes(needleLower)) {
			return { matched: true, quality: 1 };
		}

		const characters = needleLower.split('');
		let index = 0;

		for (let char of characters) {
			index = haystackLower.indexOf(char, index);
			if (index === -1) return { matched: false, quality: Infinity };
			index++;
		}

		const lengthDifference = Math.abs(needle.length - haystack.length);
		const consecutiveBonus = getConsecutiveMatches(needleLower, haystackLower);

		const matchQuality = lengthDifference - consecutiveBonus * 2;

		return { matched: true, quality: 10 + matchQuality };
	}

	function getConsecutiveMatches(needle, haystack) {
		let consecutiveMatches = 0;
		let maxConsecutive = 0;
		let needleIndex = 0;

		for (let i = 0; i < haystack.length; i++) {
			if (needleIndex < needle.length && haystack[i] === needle[needleIndex]) {
				consecutiveMatches++;
				needleIndex++;
				maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
			} else {
				consecutiveMatches = 0;
			}
		}

		return maxConsecutive;
	}

	function searchClub(club, query) {
		const terms = query.toLowerCase().split(/\s+/);

		const nameResult = fuzzySearch(query, club.name);

		let missionResult = { matched: false, quality: Infinity };
		if (club.mission) {
			missionResult = fuzzySearch(query, club.mission);
			// Apply lower quality score (higher priority) if specific keywords are found
			if (missionResult.matched) {
				// Check for keyword matches in mission
				for (const term of terms) {
					if (club.mission.toLowerCase().includes(term)) {
						// Boost quality for keyword matches
						missionResult.quality *= 0.8;
					}
				}
			}
		}

		// Check for keyword matches in name (highest boost)
		if (nameResult.matched) {
			for (const term of terms) {
				if (club.name.toLowerCase().includes(term)) {
					// Significant boost for keyword in name
					nameResult.quality *= 0.5;
				}
			}
		}

		// Check if the club is of a specific type that matches the query
		// For example, if query contains "consulting" and the club is a consulting club
		let categoryBoost = 1;
		if (club.categories) {
			// For array of categories
			if (Array.isArray(club.categories)) {
				for (const category of club.categories) {
					for (const term of terms) {
						if (category.toLowerCase().includes(term)) {
							categoryBoost = 0.7; // Boost for category match
						}
					}
				}
			}
			// For string categories
			else if (typeof club.categories === 'string') {
				for (const term of terms) {
					if (club.categories.toLowerCase().includes(term)) {
						categoryBoost = 0.7; // Boost for category match
					}
				}
			}
		}

		// Return the best match with any applicable boosts
		if (nameResult.matched && missionResult.matched) {
			const bestResult = nameResult.quality < missionResult.quality ? nameResult : missionResult;
			bestResult.quality *= categoryBoost; // Apply category boost to final quality
			return bestResult;
		} else if (nameResult.matched) {
			nameResult.quality *= categoryBoost;
			return nameResult;
		} else if (missionResult.matched) {
			missionResult.quality *= categoryBoost;
			return missionResult;
		}

		return { matched: false, quality: Infinity };
	}

	// Filter clubs based on search query and category
	function filterClubs() {
		if (!data || !data.clubs) {
			filteredClubs = [];
			return;
		}

		// Filter by category first
		let categoryFiltered = data.clubs;
		if (selectedCategory !== 'All Categories') {
			categoryFiltered = data.clubs.filter((club) => {
				if (!club.categories) return false;

				// Handle array of categories
				if (Array.isArray(club.categories)) {
					return club.categories.includes(selectedCategory);
				}

				// Handle semicolon-separated string categories
				if (typeof club.categories === 'string') {
					// Split the string by semicolons and trim whitespace
					const categoriesArray = club.categories.split(';').map((cat) => cat.trim());
					return categoriesArray.includes(selectedCategory);
				}

				return false;
			});
		}

		// Apply fuzzy search if there's a search query
		if (searchQuery.trim() === '') {
			filteredClubs = categoryFiltered;
		} else {
			// Get all clubs that match fuzzy search in name or mission
			const searchResults = categoryFiltered
				.map((club) => {
					const result = searchClub(club, searchQuery);
					return result.matched ? { ...club, matchQuality: result.quality } : null;
				})
				.filter((result) => result !== null);

			// Sort by match quality (best matches first)
			searchResults.sort((a, b) => a.matchQuality - b.matchQuality);
			filteredClubs = searchResults;
		}
	}

	// Watch for changes in data, searchQuery, and selectedCategory
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
	</nav>
</header>

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
</style>
