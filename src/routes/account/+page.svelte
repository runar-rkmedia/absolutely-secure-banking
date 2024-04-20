<script lang="ts">
	const { data } = $props()
</script>

<h1 class="text-4xl mb-8">Site hacked, listing user table under scope {data.scope}:</h1>

<div class="overflow-x-auto">
	<table class="table max-w-96">
		<!-- head -->
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Password</th>
				<th>Password MD5</th>
				<th>Password argon2</th>
				<th>Credit</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			{#each data.users || [] as user}
				<tr class="bg-base-200">
					<th>{user.id}</th>
					<td>{user.username}</td>
					<td>{user.password}</td>
					<td>{user.md5password}</td>
					<td>{user.argon2Password}</td>
					<td>${user.credit}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<form method="post">
	<label> Username <input name="username" type="text" minlength="3" required /> </label>
	<label> Passord <input name="password" type="text" minlength="3" required /> </label>
	<button type="submit">Create new user</button>
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
