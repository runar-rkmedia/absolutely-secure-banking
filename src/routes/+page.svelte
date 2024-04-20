<script lang="ts">
	let { form } = $props();
</script>

<hgroup class="">
	<h1 class="text-3xl font-bold underline mb-4">Absolute secure banking</h1>
	<p>🔒This site is secure, we even have two padlocks 🔒</p>
</hgroup>

<form class="group max-w-96" method="post">
	{#if form?.message}
		<div role="alert" class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{form?.message}</span>
		</div>
	{/if}
	<label>
		Username <input
			name="username"
			type="text"
			placeholder="You username here"
			minlength="3"
			required
		/>
	</label>
	<label>
		Passord <input name="password" type="text" placeholder="" minlength="3" required />
	</label>
	<button type="submit">Log in</button>
</form>

<style lang="postcss">
	form {
		@apply py-5 flex-col gap-48;
	}
	button[type='submit'] {
		@apply group-invalid:disabled group-invalid:opacity-25 btn btn-primary;
	}
	label {
		@apply input input-bordered flex items-center gap-2;
		input {
			@apply grow;
		}
	}
</style>
