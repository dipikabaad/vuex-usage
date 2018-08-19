import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import { ADD_PRODUCT_TO_CART, CHECKOUT, INCREASE_PRODUCT_QUANTITY, UPDATE_COUPON_CODE} from './mutation-types'

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
        },
        couponCode: ''
    },
    actions:{
        [ADD_PRODUCT_TO_CART]({commit, getters}, payload){
            
            return new Promise((resolve, reject) => {
                let cartItem = getters.getCartItem(payload.product);
                payload.cartItem = cartItem;


                if (cartItem == null){
                    let requestUrl = 'http://localhost:3000/cart/add/{productId}/{quantity}';
                    Vue.http.post( requestUrl, {}, {
                    params: {
                            productId: payload.product.id,
                            quantity: payload.quantity
                        }
                    }).then(
                        response => {

                            commit(ADD_PRODUCT_TO_CART, payload);
                            resolve();
                        },
                        response =>{ 
                            alert("Coould not add product to cart");
                            reject();
                        }
                    );

                } else {
                    let requestUrl = 'http://localhost:3000/cart/increase-quantity/{productId}';
                    Vue.http.post( requestUrl, {}, {
                    params: {
                            productId: payload.product.id,
                            
                        }
                    }).then(
                        response => {
                            commit(INCREASE_PRODUCT_QUANTITY, payload);
                            resolve();
                        },
                        response => {
                             alert("Coould not increase product quantity");
                             reject();
                        }
                    );

                }

            })

            //context.commit(ADD_PRODUCT_TO_CART, payload);



            
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
        },

        getCartItem: (state) => (product) => {
                            let cartItem = null
                // TODO: Implement
                for (let i = 0; i < state.cart.items.length; i++){
                    if (state.cart.items[i].product.id == product.id){
                        return state.cart.items[i];
                    }
                }
                return null;
        }


        /*taxAmount: (state, getters) => {
            return function(percentage){
                return ((getters.cartTotal * 10)/100);
            };
            
        }*/
    },
    mutations: {
        [CHECKOUT](state){
            
                state.cart.items.forEach(function(item){
                     item.product.inStock += iterm.quantity;
                 });
                state.cart.items = [];
               
            
        },
        [ADD_PRODUCT_TO_CART](state, payload) {

                    state.cart.items.push({
                        product: payload.product,
                        quantity: payload.quantity
                    });
                payload.product.inStock -= payload.quantity;

                


            },
        [INCREASE_PRODUCT_QUANTITY] (state, payload){
            payload.cartItem.quantity += payload.quantity;
            payload.product.inStock -= payload.quantity;
        },

        [UPDATE_COUPON_CODE](state, payload){
            state.couponCode = payload;
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