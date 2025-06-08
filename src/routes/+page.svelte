<script>
	let { data } = $props();
	let showResults = $state(false);

	// Get the user session from the data prop
	const user = $derived(data.session?.user);

	function createSlug(text) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}

	function handleSearch(event) {
		const searchTerm = event.target.value.trim();
		if (searchTerm.length > 0) {
			showResults = true;
		} else {
			showResults = false;
		}
	}

	function handleBlur() {
		setTimeout(() => {
			showResults = false;
		}, 200);
	}
</script>

<div class="container-1">
	<div class="cover">
		<img class="image" src="/img4.jpg" alt="img" />
		<div class="overlay"></div>
	</div>
	<div class="description">Rate and review clubs at USC</div>
	<div class="search-bar-container">
		<input
			type="text"
			class="search-bar"
			placeholder="Search for a club"
			oninput={handleSearch}
			onBlur={handleBlur}
		/>
	</div>
	<div class="all-clubs">
		<a href="/all-clubs">Browse all clubs</a>
	</div>
</div>

<style>
	.image {
		width: 100%;
		height: 450px;
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
	.description {
		position: absolute;
		color: white;
		font-size: 27px;
		font-weight: 900;
		font-family: 'Mulish';
		text-align: center;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}
	.search-bar-container {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50%;
		z-index: 2;
		text-align: center;
	}

	.search-bar {
		width: 100%;
		padding: 15px;
		margin-bottom: 20px;
		border-radius: 10px;
		border: 1px solid #ccc;
		font-size: 16px;
	}
	.all-clubs {
		position: absolute;
		z-index: 2;
		top: 47%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		text-decoration: underline;
		font-family: 'Mulish';
		font-weight: bold;
		font-size: 17px;
	}
	.all-clubs :hover {
		color: skyblue;
	}
</style>
