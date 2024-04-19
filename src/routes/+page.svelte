<hgroup class="">
	<h1 class="text-3cl font-bold underline">Absolute secure banking</h1>
	<p>🔒⬅ Extra secure padlock, for you security!</p>
</hgroup>

<form class="group" method="post">
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
		&:has(:required) {
			@apply after:content-['*'] first-letter:lowercase;
		}
	}
	:global(html) {
		background-color: theme(colors.gray.100);
	}
	:global(body) {
		@apply p-4;
	}
</style>
