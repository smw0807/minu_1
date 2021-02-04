<template>
  <div>
      <h1>id {{$route.params.id}} 입니다.</h1>
      <div class="row">
          <div class="col-ms-5 col-md-offset-0">
              <figure>
                  <img class="product" v-bind:src="product.image">
              </figure>
          </div>
          <div class="col-md-12 description">
              <h1>{{product.title}}</h1>
              <p v-html="product.description"></p>
              <p class="price">{{product.price}}</p>
              <p>현재 남은 수량 : {{product.availableInventory}}</p>
              <div>
                  평점 : 
                    <span v-bind:class="{'rating-active': checkRating(n, product)}"v-for="n in 5">
                        ☆
                    </span>
              </div>
          </div>
          <div class="col-md-6">
              <router-link tag="button" class="btn btn-primary" v-bind:to="{name: 'iMain'}">
                돌아가기
              </router-link>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            product: ''
        }
    },
    created: function () {
        axios.get('/static/products.json').then((rs) => { //Axios 라이브러리와 함께 정적 파일을 가져온다.
            this.product = rs.data.products.filter(data => 
                data.id == this.$route.params.id)[0] //경로 매개변수와 this.product가 일치하는 데이터만 추가한다.
            this.product.image = '/' + this.product.image; //상대 경로를 위해 product.image 앞에 / 를 추가
        });
    },
    methods: {
        checkRating(n, myProduct) {
            return myProduct.rating >= n;
        }
    }
}
</script>

<style>

</style>