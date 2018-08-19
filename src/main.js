import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';

Vue.filter('currency', function(value) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    
    return formatter.format(value);
});

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);

const store = new Vuex.Store({
    state:{
        cart:{
                items: []
        }
    },
    getters: {
        cartTotal: (state) => {
            let total =0;

            state.cart.items.forEach(function(item){
                total += item.product.price * item.quantity;
            });
            return total;
        },
        //es6 syntax for following
        taxAmount: (state, getters) => (percentage) => {
            return ((getters.cartTotal * 10)/100);
        }
        /*taxAmount: (state, getters) => {
            return function(percentage){
                return ((getters.cartTotal * 10)/100);
            };
            
        }*/
    },
    mutations: {
        checkout(state){
            
                state.cart.items.forEach(function(item){
                     item.product.inStock += iterm.quantity;
                 });
                state.cart.items = [];
               
            
        }
    }

});


const router = new VueRouter({
    routes: routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }
        
        if (savedPosition) {
            return savedPosition;
        }
        
        return { x: 0, y: 0 };
    }
});

Vue.http.options.root = 'http://localhost:3000';

new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    store: store
});