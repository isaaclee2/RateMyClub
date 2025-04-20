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

<div class="container-1">
	<div class="cover">
		<img class="image" src="/img4.jpg" alt="img" />
		<div class="overlay"></div>
	</div>
	<div class="description">Rate and review clubs at USC</div>
	<div class="search-bar-container">
		<input type="text" class="search-bar" placeholder="Search for a club" />
	</div>
	<div class="all-clubs">
		<a href="/all-clubs">Browse all clubs</a>
	</div>
</div>

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
