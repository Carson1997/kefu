<!-- 新建表格头部 -->
<template>
  <el-dialog title="选择表格属性" :visible="dialogVisible" width="85%" top="3vh" :close-on-click-modal="false" :before-close="handleClose">
    <div class="input-area" :style="{ height: areaHeight + 'px' }">
      <div class="select-attr-area"> <!-- 已经选择的属性 -->
        <span class="each-select-attr" v-for="(item, index) in showAttr" :key="index">{{ item }}</span>
        <div class="clear"></div>
      </div>
      <div class="all-attr-area"> <!-- 所有属性 -->
        <div class="head">
          <div class="xiangmu">项目</div>
          <div class="ziduan">字段</div>
          <div class="clear"></div>
        </div>
        <div class="body">
          <div class="xiangmu">
            <div @click="changeFather(item.name)" :class="nowFatherAttr == item.name ? 'active' : ''" class="each-father" v-for="(item, index) in allAttr" :key="index">{{ item.name }}</div>
          </div>
          <div class="ziduan">
            <el-checkbox-group @change="selectAttrChange" v-model="selectAttr">
              <el-checkbox class="each-children" v-for="(item, index) in optionsShow" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-button type="primary" plain size="small" class="center" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'newTableHead',

  computed: {
    dialogVisible: function () { // 是否显示对话框
      if (this.$store.state.NOW_OPEN_DIALOG == "newTableHead") {
        return true;
      } else {
        return false;
      }
    },

    optionsShow: function () {
      if (this.allAttr) {
        if (this.nowFatherAttr) {
          return this.allAttr[this.nowFatherAttr]['children']; 
        }
      }
    },
  },

  data: function () {
    return {
      areaHeight: document.body.clientHeight - 140, // 区域高度
      allAttr: {}, // 所有的属性数据
      nowFatherAttr: '', // 当前选中的父级属性
      selectAttr: [], // 选中的属性
      attrObj: {}, // 所有的属性
      showAttr: [], // 展示的选中的属性
    }
  },

  mounted: function () {
    this.init();
    this.getAllData();
  },

  props: [ 'fatherSelect' ],

  methods: {

    // 初始化
    init: function () {
      if (this.fatherSelect) {
        this.selectAttr = this.fatherSelect.split(',');
      }
    },

    // 关闭对话框
    handleClose: function () {
      this.$emit('close');
    },

    // 获取所有属性数据
    getAllData: function () {
      let url = this.$INTERFACE.ALL_DATA_LABEL;
      this.$NORMAL_POST(url).then(this.getAllDataPromise);
    },

    // 获取所有属性数据  请求后的处理函数
    getAllDataPromise: function (res) {
      let data = this.$PUBILC.changeArrToHierarchyNormal(res.data);
      this.allAttr = data;
      this.nowFatherAttr = Object.keys(data)[0];
      let attrObj = {};
      for (let i in res.data) {
        attrObj[res.data[i]['id']] = res.data[i]['name'];
      }
      this.attrObj = attrObj;
      this.selectAttrChange();
    },

    // 修改父级
    changeFather: function (name) {
      this.nowFatherAttr = name;
    },

    // 选择更新
    selectAttrChange: function () {
      let showArr = [];
      for (let i in this.selectAttr) {
        showArr.push(this.attrObj[this.selectAttr[i]]);
      }
      this.showAttr = showArr;
    },

    // 提交
    submit: function () {
      if (this.selectAttr.length == 0) {
        this.$PUBILC.alert(this, '请选择属性');
        return false;
      }
      this.$emit('submit', this.selectAttr.join(','));
    },
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  padding: 20px;
  border-top: solid 1px #ebebeb;
}

.select-attr-area, .all-attr-area {
  width: 100%;
}

.select-attr-area {
  max-height: 15%;
  overflow: auto;
}

.all-attr-area {
  margin-top: 1%;
  height: calc(84% - 50px);
  box-shadow: 0 0 1px lightgray;
}

.head {
  width: 100%;
  height: 40px;
  background: #f5f5f5;
  border: solid 1px #ececec;
}

.head .xiangmu {
  width: 30%;
  float: left;
  line-height: 40px;
  padding-left: 20px;
}

.head .ziduan {
  width: 60%;
  float: left;
  line-height: 40px;
  padding-left: 20px;
}

.body {
  width: 100%;
  height: calc(100% - 40px);
}

.body .xiangmu {
  width: 30%;
  float: left;
  padding: 5px;
  border-right: solid 1px #eeeeee;
  border-bottom: solid 1px #eeeeee;
  border-left: solid 1px #eeeeee;
  height: 100%;
  overflow: auto;
}

.body .ziduan {
  width: 70%;
  float: left;
  padding: 5px;
  height: 100%;
  border-right: solid 1px #eeeeee;
  border-bottom: solid 1px #eeeeee;
  overflow-y: auto;
}

.each-father {
  width: 100%;
  line-height: 30px;
  padding-left: 20px;
  cursor: pointer;
  transition: all .5s;
  box-sizing: border-box;
}

.each-children {
  width: calc(100% - 30px);
  line-height: 35px;
  padding-left: 20px;
  border-bottom: solid 1px #eeeeee;
}

.active {
  background: #48a6dd;
  color: rgb(228, 228, 228);
}

.each-select-attr {
  display: block;
  float: left;
  padding: 5px 10px;
  margin: 5px 10px;
  background: #999999;
  border: solid 1px rgb(221, 221, 221);
  color: white;
  border-radius: 5px;
}

.center {
  margin: 0 auto;
  margin-top: 10px;
  display: block;
}
</style>