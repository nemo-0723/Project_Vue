<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
            <el-button type="primary" >添加分类</el-button>
             <!-- 角色列表 -->
             <el-table  :data="categoryList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  prop="cat_name" label="分类名称"></el-table-column>
                <el-table-column  label="是否有效"></el-table-column>
                <el-table-column  label="排序" ></el-table-column>
                <el-table-column  label="操作">
                    <template >
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                    </template>
                </el-table-column>
             </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //商品分类列表
            categoryList:[],
        }
    },
    created(){
        this.getCategoryList()
    },
    methods:{
        async getCategoryList(){
            const result = await this.$http.get('categories',{params:{type:1,}});
            const res = result.data;
            console.log(res);
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg)
            this.categoryList = res.data;
        }
    }
}
</script>

<style lang="less" scoped>

</style>