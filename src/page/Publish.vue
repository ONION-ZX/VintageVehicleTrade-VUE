<template>
    <div class="header">
        <Nav/>
        <div class="container">
            <form @submit="submit" class="main-form">
                <div v-if="step==1">
                    <h1>要卖什么车?</h1>
                    <div class="input-control">
                        <label>品牌</label>
                        <Dropdown :list="brand_list"
                                :onSelect="set_brand_id"/>               
                    </div>
                    <div class="input-control">
                        <label>型号</label>
                        <Dropdown :list="model_list"
                          :onSelect="set_model_id"/>               
                    </div>
                    <div class="input-control">
                        <label>设计</label>
                        <Dropdown :list="design_list"
                                :onSelect="set_design_id"/>               
                    </div>
                </div>
                <div v-if="step==2">
                    <input v-validator="required|telephone"
                           v-model="current.phone"
                           el-error="#phone-error"
                           type="text"
                           placeholder="请输入您的手机号码">
                </div>
                <div v-if="step==3">                   
                    <h1>发布成功</h1>
                    <p>审核中...</p>
                    <router-link to="/">back to home</router-link>
                </div>
                <div class="btn-grop">
                    <button type="button" @click="prev()" v-if="step > 1 && step < 3">上一步</button>
                    <button type="button" @click="next()" v-if="step < 2">下一步</button>
                    <button type="submit" class="btn-primary" v-if="step == 2"
                      :disabled="!current.brand_id || !current.model_id || !current.phone">发布二手车
                    </button>
                </div>
                <div class="btn-primary" type="submit" hidden></div>
            </form>
        </div>
      <Footer/>
    </div>
</template>

<script>
import api from '../lib/api';
import faker from '../lib/faker';

import session  from '../lib/session';

import Dropdown from '../components/Dropdown';
import Nav from '../components/Nav';
import Footer from '../components/Footer';


export default {
    components: { Nav, Dropdown, Footer},
    mounted() {
        this.list_brand();
        this.list_model();
        this.list_design();
    },
    data() {
        return {
            step: 1,
            current: {},
            brand_list: [],
            model_list: [],
            design_list: [],
        };
    },
    methods: {
        prev() {
            if(this.step >= 3 )
                return;
            this.step--;
        },
        next() {
            if(this.step <= 1)
                return;
            this.step++;
        },
        list_brand() {
            api('brand/read')
               .then(r => {
                   this.brand_list = r.data;
               });
        },
        list_model() {
            api('model/read')
               .then(r => {
                   this.model_list = r.data;
               });
        },
        list_design() {
            api('design/read')
               .then(r => {
                   this.design_list = r.data;
               });
        },
        set_brand_id(row) {
            this.$set(this.current, 'brand_id', row.id);
        },
        set_model_id(row) {
            this.$set(this.current, 'model_id', row.id);
        },
        set_design_id(row) {
            this.$set(this.current, 'design_id', row.id);
        },
        submit(e) {
            e.preventDeault();
            let fake = {};
            let current = this.current;
            let brand = this.brand_list.find((row) => {
                return row.id == this.current.brand_id;
            }).name;
            let model = this.model_list.find((row) => {
                return row.id == this.current.model_id;
            }).name;

            current.publisher_id = session.his_id();

            fake.title = faker.title(brand, model);
            fake.price = faker.price();
            fake.publish_reason = faker.reason();
            fake.exchange_times = faker.rand_int(1,5);
            fake.birth_day = faker.rand_date();
            fake.condition = faker.rand_int();
            fake.design_id = this.design_list[faker.rand_int(0, this.design_list.length -1)].id;

            current = Object.assign({}, current, fake);
            api('vehicle/create', current)
                .then(()=> {
                    this.step == 3;
                });
        }
    }

}
</script>

<style scoped>
  .dropdown {
    width: 100%;
  }

  .input-control {
    border-bottom: 1px solid rgba(0,0,0,.3);
  }

  .input-control label {
      font-size: 16px;
  }

  .main-form {
    max-width: 500px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
  }

  h1 {
      padding-bottom: 20px;
  }

  /* .input-group-3 input, .input-control {
      border-bottom: 0;
  } */

  .bottom {
      margin-top: 20px;
  }

  .btn-group {
      margin-bottom: 10px;
  }

  .btn-primary {
      padding: 5px;
      font-size: 15px;
  }

</style>
