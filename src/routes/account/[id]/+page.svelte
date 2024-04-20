<script lang="ts">
	import { browser } from '$app/environment'

	const { data } = $props()
	if (browser) {
		$inspect(data)
	}
</script>

Welcome {data?.user?.username}

<p>
	You have ${data?.user?.credit} in your account.
</p>

<p>Would you like to send it to someone?</p>

<form method="post" class="group">
	<label>
		Amount <input
			name="amount"
			type="number"
			placeholder=""
			min={0}
			max={data?.user?.credit}
			required
		/>
	</label>
	<label>
		To account <input name="to-account" type="text" placeholder="" min={0} required />
	</label>
	<button type="submit" class="btn btn-primary">Send</button>
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
		&:has(:required) {
			@apply after:content-['*'] first-letter:lowercase;
		}
	}
</style>
