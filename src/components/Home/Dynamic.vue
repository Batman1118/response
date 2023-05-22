<template>
  <a-card title="最新叫应记录">
    <a-list item-layout="horizontal" :data-source="lists">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.created | filterTime"
        >
          <a slot="title" href="#">{{ item.title }}</a>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
export default {
  name: "Dynamic",
  data() {
    return {
      lists: [
        {
          title: "阿勒泰地区莽村 李有田 在 20230301大风红色预警提示 进行了“已安排部署”叫应。",
          created: '2023-03-1 12:12:12'
        },
        {
          title: "李宏伟 在 20230301大风红色预警提示 进行了“已安排部署”叫应。",
          created: '2023-03-12 12:12:12'
        },
        {
          title: "李宏伟 在 20230301大风红色预警提示 进行了“已安排部署”叫应。",
          created: '2023-03-12 12:12:12'
        },
        {
          title: "李宏伟 在 20230301大风红色预警提示 进行了“已安排部署”叫应。",
          created: '2023-03-12 12:12:12'
        },
        {
          title: "阿勒泰地区莽村 李有田 在 20230311大风红色预警工作通知 进行了“已安排部署”叫应。",
          created: '2023-03-12 12:12:12'
        },
        {
          title: "木木  在 20230301大风红色预警提示 进行了“已安排部署”叫应。",
          created: '2023-03-12 12:12:12'
        }
      ],
    };
  },
};
</script>
