<script lang="ts">
  let { children } = $props();
</script>

<div id="page">
  <a href="/">⨯</a>
  {@render children?.()}
</div>

<style lang="scss">
  #page {
    margin: 1.8%;

    a {
      font-size: 2vw;
      line-height: 0;
      text-decoration: none;
      color: black;
    }
  }
</style>
