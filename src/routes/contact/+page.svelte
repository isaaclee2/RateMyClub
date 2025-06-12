<script>
</script>

<div class="contact-container">
	<div class="contact-content">
		<h1 class="contact-title">Contact Us</h1>
		<div class="contact-section">
			<p class="contact-message">Have a question or feedback? We'd love to hear from you.</p>
			<p class="email-text">Please don't hesitate to email us at</p>
			<a href="mailto:ratemyclubusc@gmail.com" class="email-link">ratemyclubusc@gmail.com</a>
		</div>
	</div>
</div>

<style>
	.contact-container {
		min-height: 70vh;
		padding: 40px 20px;
		font-family: 'Mulish', sans-serif;
		background-color: white;
		max-width: 90%;
		margin: 0 auto;
	}

	.contact-content {
		width: 100%;
	}

	.contact-title {
		font-size: 40px;
		font-weight: 700;
		color: #333;
		margin-bottom: 30px;
		letter-spacing: -0.5px;
	}

	.contact-section {
		line-height: 1.6;
	}

	.contact-message {
		font-size: 16px;
		color: #555;
		margin-bottom: 15px;
		font-weight: 400;
	}

	.email-text {
		font-size: 16px;
		color: #555;
		margin-bottom: 10px;
		font-weight: 400;
	}

	.email-link {
		font-size: 16px;
		color: #c21807;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.contact-container {
			padding: 20px 15px;
		}

		.contact-title {
			font-size: 36px;
			margin-bottom: 25px;
		}

		.contact-message {
			font-size: 15px;
			margin-bottom: 12px;
		}

		.email-text {
			font-size: 15px;
		}

		.email-link {
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		.contact-title {
			font-size: 28px;
			margin-bottom: 20px;
		}

		.contact-message {
			font-size: 14px;
			margin-bottom: 10px;
		}

		.email-text {
			font-size: 14px;
		}

		.email-link {
			font-size: 14px;
		}
	}
</style>
