<script lang="ts">
	import { play } from '$lib/utils/poem';
	import { onMount } from 'svelte';

	onMount(async () => {
		await play({
			children: [
				{
					values: ['one', 'two', 'three'],
					beforeEachDelay: 500,
					style: {
						fontSize: '20px',
						color: 'red'
					}
				},
				{
					values: ['four', 'five', 'six', '!'],
					beforeEachDelay: 140,
					getStyle(i) {
						const colors = ['red', 'green', 'yellow', 'blue'];
						return {
							color: colors[i]
						};
					}
				}
			]
		});
		// play({
		//   values: ['one', 'two', 'three', '!'],
		//   beforeEachDelay: 500,
		//   style: {
		//     fontSize: '20px',
		//     color: 'red'
		//   }
		// })
	});
</script>

<div id="poem-container">
	<!-- <h1>streamside thoughts</h1>
  <p id="poem">
    here i sit, aside the once murky, now alight<br />once scared, now
    <i>curious</i>.<br />but a stream cannot widen forever.<br />as it winds on,
    can i take refuge here? here i am.
  </p> -->
	<div id="target"></div>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Figtree&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Dongle&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

	:global(body) {
		background-color: snow;
	}

	#poem-container {
		h1 {
			font-family: 'Libre Baskerville', serif;
			font-style: normal;
			font-weight: lighter;
			font-size: 3.2vw;
		}

		#poem {
			color: #2d2d2d;
			font-family: 'Figtree', sans-serif;
			font-size: 1.1vw;
		}
	}
</style>
