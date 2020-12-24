//전역등록
Vue.component('my-component', {
    template: '<div>사용자 정의 컴포넌트입니다!!!</div>'
});

var myCom = {message: 'hello'};
var message = 'hello';
Vue.component('my-com', {
    template: '<span>{{message}}</span>',
    data: function() {
        // return message;
        return myCom;
    }
})

var cnt = { counter : 0 };
Vue.component('simple-counter', {
    template: '<button v-on:click="counter += 1">{{ counter }}</button>',
    data: function () {
        // 데이터는 기술적으로 함수이므로 Vue는 따지지 않지만
        // 각 컴포넌트 인스턴스에 대해 같은 객체 참조를 반환합니다.
        /**
         * test13.ejs에 simple-counter가 3개인데 이렇게 하면 
         * 컴포넌트 인스턴스가 모두 같은 data 객체를 공유하므로 하나의 카운터를 증가시키면 
         * 모두 증가함
         */
        // return cnt; 
        return {
            counter : 0
        }// 이렇게 하면 각각 고유한 내부 상태가됨
    }
})

var child = {
    template: '<div>지역등록 컴포넌트...</div>'
};

var trTpl = {
    template: '<tr><td>tdtdtdtdtdtd1</td><td>tdtdtdtdtdtd2</td></tr>'
};
var tr_tpl = {
    template: '<tr><td>{{ td1 }}</td><td>{{ td2 }}</td></tr>',
    data: function () {
        return {
            td1: 'tdtdtdtd1',
            td2: 'tdtdtdtd2'
        }
    }
}

//루트 인스턴스 생성
var app1 = new Vue({
    el:'#app1',
    components: { //인스턴트 옵션
        'child-component': child,
        'tr-component': trTpl,
        'tr-com': tr_tpl
    }
});

// Props....
Vue.component('child', {
    //props 정의
    props: ['message', 'name'],
    //data와 마찬가지로 prop은 템플릿 내부에서 사용할 수 있으며, vm.message로 사용할 수 있다.
    template: '<span> {{ message }} 내 이름은 {{ name }}야!</span>'
})

Vue.component('case', {
    props: ['myMessage'],
    template: '<span>{{ myMessage }}</span>'
})

Vue.component('child2', {
    props: ['parentMsg'],
    template: '<span>{{parentMsg}}</span>'
})

Vue.component('todo-item', {
    props:['todo'],
    template: '<span>{{ todo }}</span>',
   
})

Vue.component('comp', {
    props:['someProp'],
    template: '<span>{{ someProp }}</span>',
    created: function () {
        console.log('child');
        console.log(this.someProp);
        console.log(typeof this.someProp);
    }
});

Vue.component('compo1', {
    props:['initialCounter','size'],
    template: '<span>{{initialCounter}} // {{size}} // {{ counter }} // {{ normalizedSize }}</span>',
    data: function () {
        return {
            counter: this.initialCounter
        }
    },
    computed: {
        normalizedSize: function () {
            return this.size.trim().toLowerCase()
        }
    }
});

//Prop 검증
Vue.component('example', {
    props:{
        //기본 타입 확인 (`null`은 어떤 타입이든 가능하다는 뜻)
        propA: Number,
        propB: [String, Number], //여러개의 타입
        propC: {
            type: String, //문자열
            required: true //꼭 필요
        },
        propD: {
            type: Number, //숫자
            default: 100 //기본 값
        },
        propE: { //객체/배열의 기본값에 팩토리 함수에서 반환되어야 한다?
            type: Object,
            default: function () {
                return { message : 'hello' }
            }
        },
        propF: { //사용자 정의 유효성 기능
            validator: function (value) {
                return value > 10
            }
        }
    },
    template: '<span>{{ propC }}</span>'
});

//vue인스턴스가 부모, component가 자식
var app2 = new Vue({ 
    el:'#app2',
    data: {
        message: '안녕?',
        parentMsg: 'parentMessage11',
        todo: {
            text: 'Learn Vue',
            isComplete: false
        }
    }
})

Vue.component('bs-date-input', {
    template: '<input type="text">'
})

Vue.component('button-counter', {
    template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
    // template: '<button v-on:increment="incrementTotal" v-on:click="incrementCounter">{{ counter }}</button>',
    // ㄴ> incrementTotal이게 부모에 있는거라 에러발생
    data: function () {
        return {
            counter: 0
        }
    },
    methods: {
        incrementCounter: function () {
            console.log('incrementCounter');
            this.counter += 1;
            this.$emit('increment');
            // this.$emit('click'); //이건 됨 
            //incrementCounter를 실행하면서 increment를 트리거하여 
            //부모 methods의 incrementTotal를 실행시킴
            // this.$on('incrementTotal'); //안됨 이건
        }
    }
}) //난 아직까진 이렇게 컴포넌트를 만들어서 저런식으로 소스를 짜고 쓴다는게 이해가 안된다.

Vue.component('currency-input', {
    template: '\
        <span>\
        $\
        <input ref="input" \
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
        </span>\
    ',
    props: ['value'],
    methods: {
        updateValue: function (value) {
            console.log("??");
            var formattedValue = value.trim().slice(0, value.indexOf('.') === -1 
            ? value.length : value.indexOf('.') + 3);
            if (formattedValue !== value) {
                this.$refs.input.value = formattedValue;
            }
            //입력 이벤트를 통해 숫자 값을 내보낸다.
            this.$emit('input', Number(formattedValue));
            console.log()
        }
    }
})

Vue.component('currency-inputs', {
    template: '\
      <div>\
        <label v-if="label">{{ label }}</label>\
        $\
        <input\
          ref="input"\
          v-bind:value="value"\
          v-on:input="updateValue($event.target.value)"\
          v-on:focus="selectAll"\
          v-on:blur="formatValue"\
        >\
      </div>\
    ',
    props: {
      value: {
        type: Number,
        default: 0
      },
      label: {
        type: String,
        default: ''
      }
    },
    mounted: function () {
      this.formatValue()
    },
    methods: {
      updateValue: function (value) {
        var result = currencyValidator.parse(value, this.value)
        if (result.warning) {
          this.$refs.input.value = result.value
        }
        this.$emit('input', result.value)
      },
      formatValue: function () {
        this.$refs.input.value = currencyValidator.format(this.value)
      },
      selectAll: function (event) {
        // Workaround for Safari bug
        // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
        setTimeout(function () {
            event.target.select()
        }, 0)
      }
    }
  })

Vue.component('my-checkbox', {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        //다른 목적을 위해 value prop을 사용할 수 있다.
        checked: Boolean,
        value: String
    }
})
//<my-checkbox v-model="foo" value="some value"></my-checkbox>

var app3 = new Vue({
    el: '#app3',
    data: {
        total: 0,
        price: 0,
    },
    methods: {
        incrementTotal: function () {
            console.log("incrementTotal");
            this.total += 1;
        }
    },
    computed: {
        getTotal: function () {
            return (this.price).toFixed(3);
        }
    }
})

Vue.component('child-component2', {
    template: '<div v-show="someChildProperty">Child!!</div>',
    data: function () {
        return {
            someChildProperty: true
        }
    }
})

var app4 = new Vue({
    el: '#app4',
    data: {
        someChildProperty: true
    }
})