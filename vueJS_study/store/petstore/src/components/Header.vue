<template>
<header>
  <div class="navbar navbar-default">
    <div class="navbar-header">
      <h1><router-link :to="{name: 'iMain'}">{{ sitename }}</router-link></h1> <!-- iMain 경로로 연결한다. -->
      <!--
          router-link는 vue-router 라이브러리의 일부의 요소
          router-link 요소는 경로 간의 Vue.js 애플리케이션 안에 내부 링크를 생성한다.
          to 속성을 가지고 있으면, 해당 속성이 지정된 경로에 연결할 수 있다.
          -->
    </div>
    <div class="nav navbar-nav navbar-right cart">
      <!-- <button type="button" class="btn btn-default btn-lg" v-on:click="showCheckout">
        <span class="glyphicon glyphicon-shopping-cart">{{cartItemCount}}</span> 체크아웃
      </button> -->
      <router-link
          active-class="active"
          tag="button" class="btn btn-default btn-lg" :to="{name: 'Form'}">
        <span class="glyphicon glyphicon-shopping-cart">{{cartItemCount}}</span> 체크아웃
      </router-link>
    </div>
  </div>
</header>
</template>

<script>
export default {
  name: 'my-header',
  data() {
    return {
      sitename: "Vue.js 애완용품샵"
    }
  },
  props: ['cartItemCount'],
  methods: {
    showCheckout() {
      this.$router.push({name: 'Form'}); //Vue.js 앱을 Form 경로로 이동하게 해줌
    }
  }
}
</script>

<style scoped>
/**
    scoped 옵션으로 인해 해당 컴포넌트에 CSS 범위가 지정될 수 있도록 한다.
 */
a {
  text-decoration: none;
  color: black;
}

.router-link-exact-active {
  /* color: blue; */
  color: black;
}
</style>

