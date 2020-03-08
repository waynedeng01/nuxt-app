<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item,idx) in menu" :key="idx" @mouseenter="enter">
        <i :class="item.type" />
        {{ item.name }}
        <span class="arrow" />
      </dd>
    </dl>
    <div v-if="kind" class="detail" @mouseenter="sover" @mouseleave="sout">
      <!-- 子列表也可能循环 -->
      <template v-for="(item,idx) in curdetail.child">
        <h4 :key="idx">{{ item.title }}</h4>
        <span v-for="v in item.child" :key="v">{{ v }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: "",
      menu: [
        {
          type: "food",
          name: "美食",
          child: [
            {
              title: "美食",
              child: ["代金券", "甜点饮品", "火锅", "自助餐", "小吃快餐"]
            }
          ]
        },
        {
          type: "takeout",
          name: "外卖",
          child: [
            {
              title: "外卖",
              child: ["美团外卖"]
            }
          ]
        },
        {
          type: "hotel",
          name: "酒店",
          child: [
            {
              title: "酒店星级",
              child: ["经济型", "舒适/三星", "高档/四星", "豪华/五星"]
            }
          ]
        }
      ]
    };
  },
  computed: {
    //   通过计算属性判断出当前子菜单是哪一个类的子菜单
    curdetail() {
      return this.menu.filter(item => item.type === this.kind)[0];
    }
  },
  methods: {
    mouseleave: function() {
      let self = this;
      //   防止鼠标刚移出左边就导致右侧子框消失
      self._timer = setTimeout(function() {
        self.kind = "";
      }, 150);
    },
    enter: function(e) {
      this.kind = e.target.querySelector("i").className;
    },
    sover: function() {
      clearTimeout(this._timer);
    },
    sout: function() {
      this.kind = "";
    }
  }
};
</script>

<style>
</style>