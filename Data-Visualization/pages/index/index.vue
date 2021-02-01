<template>
	<view class="content">
		<view class="title">uniCloud 基础示例</view>
		<view class="tips">
			<view>1.在cloudfunctions目录右键创建并关联服务空间</view>
			<view>2.在cloudfunctions目录内db_init.json上右键初始化云数据库</view>
			<view>3.在cloudfunctions目录右键选择“上传所有云函数”</view>
			<view>开始愉快的体验uniCloud吧！</view>
		</view>
		<view class="btn-list">
			<button type="primary" @click="add">新增一条数据</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
    created : function (){

    },
		methods: {
			async add() {
			  let data = await uniCloud.callFunction({name: 'getInfo', data: { gameId: 3 }})
      },
      
	  },
  }
</script>

<style>
	.content {
		padding-bottom: 30px;
	}

	.title {
		font-weight: bold;
		text-align: center;
		padding: 20px 0px;
		font-size: 20px;
	}

	.tips {
		color: #999999;
		font-size: 14px;
		padding: 20px 30px;
	}

	.btn-list {
		padding: 0px 30px;
	}

	.btn-list button {
		margin-bottom: 20px;
	}

	.upload-preview {
		width: 100%;
	}
</style>
