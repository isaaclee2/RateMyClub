<script>
	export let data;
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

<div class="content-container">
	<div class="breadcrumb">
		<a href="/">Home</a> >
		<a href="/all-clubs">Clubs</a> >
		<span class="current">{data.club.name}</span>
	</div>

	<div class="header-container">
		<img src={data.club.image} alt="No Logo :(" />
		<div class="club-header-container">
			<div class="club-header">
				<div class="title-category-container">
					<h1 class="club-title">{data.club.name}</h1>
				</div>
			</div>
			<div class="overall-rating-container">
				<h1 class="overall-rating">★★★★★</h1>
				<h1 class="overall-score">({data.club.overall_rating})</h1>
				<h1 class="number-of-ratings">{data.club.num_ratings} ratings</h1>
			</div>
		</div>
	</div>

	<hr class="hr" />

	<div class="big-container">
		<div class="container1">
			<div class="club-info">
				<div class="mission-header">Mission Statement:</div>
				<div class="mission-statement">{data.club.mission}</div>

				<div class="category-header">Categories:</div>
				<div class="club-cateogry">{data.club.categories}</div>

				<div class="website-header">Website:</div>
				<div class="link">
					<a href={data.club.website} target="_blank" class="website-link">{data.club.website}</a>
				</div>
			</div>
		</div>
		<div class="container2">
			<div class="box">
				<div class="box-header-container">
					<div class="breakdown-container">
						<div class="sub-container">
							<h1 class="breakdown-header">Rating breakdown:</h1>
							<div class="criteria">
								<div class="criteria1">
									<svg
										class="h-6 w-6 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 6.5h2M11 18h2m-7-5v-2m12 2v-2M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm12 0h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0-12h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"
										/>
									</svg>
									Leadership & Organization
								</div>
								<div class="criteria2">
									<svg
										class="h-6 w-6 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>

									Inclusivity & Diversity
								</div>

								<div class="criteria3">
									<svg
										class="h-6 w-6 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
										/>
									</svg>
									Professional/Personal Development
								</div>
								<div class="criteria4">
									<svg
										class="h-6 w-6 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-width="2"
											d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
										/>
									</svg>
									Social Engagement
								</div>
							</div>
						</div>
						<div class="sub-ratings">
							<div class="breakdown-header">&nbsp</div>
							<!--This is for empty space-->
							<div class="sub-star-container">
								<div class="sub-star">★★★★★</div>
								<div class="sub-star">★★★★★</div>
								<div class="sub-star">★★★★★</div>
								<div class="sub-star">★★★★★</div>
							</div>
						</div>
					</div>
					<div class="club-details-container">
						<div>
							<h1 class="club-details-header">Club details:</h1>
							<div class="details-container">
								<div>
									<div class="size-container">
										<div class="size-header">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												width="24"
												height="24"
												stroke-width="2"
											>
												<path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
												<path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"></path>
												<path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
												<path d="M17 10h2a2 2 0 0 1 2 2v1"></path>
												<path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
												<path d="M3 13v-1a2 2 0 0 1 2 -2h2"></path>
											</svg>Club size:
										</div>
									</div>
									<div class="selectivity-container">
										<div class="selectivity-header">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												width="24"
												height="24"
												stroke-width="2"
											>
												<path d="M15 13v4"></path>
												<path d="M13 15h4"></path>
												<path d="M15 15m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
												<path d="M22 22l-3 -3"></path>
												<path d="M6 18h-1a2 2 0 0 1 -2 -2v-1"></path>
												<path d="M3 11v-1"></path>
												<path d="M3 6v-1a2 2 0 0 1 2 -2h1"></path>
												<path d="M10 3h1"></path>
												<path d="M15 3h1a2 2 0 0 1 2 2v1"></path>
											</svg>Selectivity:
										</div>
										<div class="selectivity"></div>
									</div>
								</div>
								<div class="details-data">
									<div class="size">
										{data.club.size || 'Unknown'}
									</div>
									<div class="selectivity">
										{data.club.selectivity || 'Unknown'}
									</div>
								</div>
							</div>
						</div>
						<button type="button" class="review-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 22 22"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								width="22"
								height="22"
								stroke-width="2"
							>
								<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
								<path d="M13.5 6.5l4 4"></path>
							</svg>
							Write a review</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="reviews-container">
		<h1 class="reviews-header">Reviews ({data.club.num_ratings})</h1>
	</div>
</div>

<button class="back-to-top">↑</button>

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

	/* Content Styling */
	.content-container {
		max-width: 1300px;
		margin: 0px auto 0px;
		margin-top: -10px;
		padding: 0 10px;
		font-family: 'Mulish', sans-serif;
	}

	.breadcrumb {
		margin-bottom: 10px;
		font-size: 14px;
		color: #666;
		margin-left: 10px;
	}
	.breadcrumb a {
		color: #c21807;
		text-decoration: none;
	}
	.breadcrumb a:hover {
		text-decoration: underline;
	}
	.breadcrumb .current {
		font-weight: bold;
	}

	.header-container {
		display: flex;
		flex-direction: row;
	}
	img {
		height: 80px;
		margin-right: 15px;
		margin-top: 10px;
	}

	.club-header {
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.club-header-container {
		display: flex;
		flex-direction: column;
	}
	.title-category-container {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
	}
	.club-title {
		font-size: 32px;
		font-weight: 700;
		margin: 0;
		color: #333;
	}
	.overall-rating-container {
		display: flex;
		flex-direction: row;
	}
	.overall-rating {
		margin-left: 10px;
		margin-top: -20px;
		font-size: 35px;
		color: #ffa534;
	}
	.overall-score {
		margin-left: 10px;
		margin-top: -8px;
		font-size: 20px;
		color: #ffa534;
	}
	.number-of-ratings {
		margin-left: 20px;
		margin-top: -4px;
		font-weight: bold;
	}

	.hr {
		margin-top: 10px;
		margin-bottom: 20px;
		width: 100%;
	}
	.big-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: -10px;
	}
	.container1 {
		width: 60%;
		padding: 10px;
		margin-left: 15px;
	}
	.club-info {
		width: 95%;
	}
	.mission-header {
		margin-top: 0px;
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}
	.mission-statement {
		margin: 20px 0px 20px 0px;
		width: fit-content;
		background-color: #f7f7f7f6;
		padding: 10px 10px 10px 20px;
		font-style: italic;
		border-radius: 20px;
		color: #555;
		border-left: 4px solid #c21807;
		word-spacing: 2px;
		line-height: 1.7;
	}

	.website-header {
		margin-top: 30px;
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}
	.website-link {
		color: #3d91cd;
	}
	.link {
		margin: 0px 10px;
		width: fit-content;
		padding: 10px;
		border-radius: 13px;
		border-left: 0;
	}
	.website-link:hover {
		text-decoration: underline;
	}
	.category-header {
		margin-top: 25px;
		font-size: 20px;
		font-weight: 700;
		color: #333;
	}

	.club-cateogry {
		width: fit-content;
		margin-top: 15px;
		margin-left: 15px;
		font-size: 15px;
		color: #666;
		background-color: #f7f7f7f6;
		padding: 7px 15px 7px 15px;
		border-radius: 30px;
		font-style: italic;
	}
	.container2 {
		width: 40%;
		padding: 10px;
		margin-left: 15px;
	}
	.box {
		width: 100%;
		height: 400px;
		margin-top: 10px;
		background-color: white;
		border-radius: 20px;
		border-color: #dfdfdf;
		border-width: 1px;
		border-style: solid;
	}
	.box-header-container {
		display: flex;
		flex-direction: column;
	}

	.breakdown-container {
		width: 100%;
		padding: 30px;
		padding-bottom: 0;
		display: flex;
		flex-direction: row;
	}
	.sub-container {
		margin-left: 5px;
	}
	.breakdown-header {
		font-weight: bold;
		font-size: 18px;
		margin-bottom: 10px;
		color: #c21807;
	}
	.criteria {
		font-size: 13px;
		padding-top: 10px;
	}
	.criteria1,
	.criteria2,
	.criteria3,
	.criteria4 {
		padding-top: 5px;
		padding-bottom: 10px;
		display: flex;
		flex-direction: row;
	}

	svg {
		margin-right: 10px;
		margin-top: -2px;
	}
	.sub-star-container {
		margin-top: 21px;
		margin-left: 80px;
	}

	.sub-star {
		color: #ffa534;
		font-size: 17px;
		padding-bottom: 12px;
	}
	.club-details-container {
		width: 100%;
		padding: 30px;
		margin-left: 5px;
		font-size: 14px;
		display: flex;
		flex-direction: row;
	}
	.club-details-header {
		font-weight: bold;
		font-size: 18px;
		margin-left: 0px;
		color: #c21807;
	}
	.details-container {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
	}
	.details-data {
		margin-left: 30px;
	}
	.size {
		margin-bottom: 20px;
	}
	.size-container {
		display: flex;
		flex-direction: row;
	}
	.size-header {
		display: flex;
		flex-direction: row;
	}
	.selectivity-container {
		margin-top: 20px;
	}
	.selectivity-header {
		display: flex;
		flex-direction: row;
	}

	.review-button {
		margin-top: 55px;
		margin-left: 50px;
		width: 180px;
		height: 50px;
		background-color: #c21807;
		color: white;
		border-radius: 10px;
		font-size: 17px;
		font-weight: bold;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.review-button:hover {
		background-color: #a01400;
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
	}
	.reviews-header {
		font-size: 30px;
		margin-left: 20px;
		margin-top: 20px;
	}

	.back-to-top {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 45px;
		height: 45px;
		border-radius: 40%;
		background-color: #c21807;
		color: white;
		font-size: 22px;
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
