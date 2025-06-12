<script>
</script>

<div class="about-container">
	<div class="about-content">
		<h1 class="about-title">About</h1>
		<div class="about-section">
			<p class="about-text">
				Rate My Club USC is a platform built by students, for students. We believe finding the right
				club shouldn't be a guessing game.
			</p>
			<p class="about-text">
				Our mission is simple: help USC students discover clubs and organizations that align with
				their interests through honest, student-written reviews and ratings.
			</p>
			<p class="about-text">
				Whether you're looking for academic organizations, recreational clubs, or professional
				development opportunities, we're here to make your search easier and more informed.
			</p>
		</div>
	</div>
</div>

<style>
	.about-container {
		min-height: 70vh;
		padding: 40px 20px;
		font-family: 'Mulish', sans-serif;
		background-color: white;
		max-width: 90%;
		margin: 0 auto;
	}

	.about-content {
		width: 100%;
	}

	.about-title {
		font-size: 40px;
		font-weight: 700;
		color: #333;
		margin-bottom: 30px;
		letter-spacing: -0.5px;
	}

	.about-section {
		line-height: 1.6;
	}

	.about-text {
		font-size: 16px;
		color: #555;
		margin-bottom: 30px;
		font-weight: 400;
	}

	.about-text:last-child {
		margin-bottom: 0;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.about-container {
			padding: 20px 15px;
		}

		.about-title {
			font-size: 36px;
			margin-bottom: 25px;
		}

		.about-text {
			font-size: 15px;
			margin-bottom: 12px;
		}
	}

	@media (max-width: 480px) {
		.about-title {
			font-size: 28px;
			margin-bottom: 20px;
		}

		.about-text {
			font-size: 14px;
			margin-bottom: 10px;
		}
	}
</style>
