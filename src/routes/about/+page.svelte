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
	.about {
		text-decoration: underline;
		color: #c21807;
	}
	.contact:hover {
		text-decoration: underline;
	}
</style>
