<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/stores'
	if (browser) {
		$inspect($page)
	}
</script>

<h1 class="text-3xl">{$page.status}: {$page.error?.message}</h1>

<pre style="color: hotpink; background: black; width: 100%; text-align: left;">
{$page.error?.stack}
</pre>
