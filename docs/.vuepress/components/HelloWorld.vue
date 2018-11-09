<template>
    <div>{{test}}</div>
</template>
<script>
export default {
  data() {
    return {
      test: 'hello world'
    };
  },
  mounted() {
    console.log('hello world.vue ');
  }
};
</script>

