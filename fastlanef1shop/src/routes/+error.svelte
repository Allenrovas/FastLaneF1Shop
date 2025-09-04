<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<h1>Oops! Algo salió mal</h1>
	<p>Error {$page.status}: {$page.error?.message}</p>
	<a href="/">Volver al inicio</a>
</div>

<style>
	.error-page {
		text-align: center;
		padding: 2rem;
	}
</style>