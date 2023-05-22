<template>
	<div class="inner">
		<h2>标题：{{title}}</h2>
		<p><b>类别：</b>{{category}}</p>
		<p><b>级别：</b><a-tag :color="level === '黄色' ? 'yellow' :level === '橙色'? 'orange':level === '红色'?'red':'blue'">
					{{ level }}
				</a-tag></p>
		<p><b>发布单位：</b>{{department}}</p>
		<p><b>短信内容：</b><i>{{smsmessage}}</i></p>
		<p><b>附件内容：</b><a :href=attachment.url><a-icon type="link" />  {{attachment.title}}</a></p>
		<p><b>响应状态：</b>
		<span v-if="receipt=='待叫应'"
					style='background-color:blue;padding:5px;color:#fff;border-radius: 5px;'>{{receipt}}</span>
				<span v-else-if="receipt=='已叫应'"
					style='background-color:limegreen;padding:5px;color:#2a2a2a;border-radius: 5px;'>{{receipt}}</span>
				<span v-else style='background-color:red;padding:5px;color:#fff;border-radius: 5px;'>{{receipt}}
				</span></p>
	</div>
</template>

<script>
	export default{
		data(){
			return{
						key: 1,
						id:1001,
						time: '2023年5月3日 15:30',
						department: '自治区预警中心',
						category: '气象',
						level: '黄色',
						title: '标题：全疆（地区）高温橙色预警',
						attachment: {
							title:'中央气象台2023年5月3日报告',
							url:'http://www.baidu.com'
						},
						smsmessage: '【自然灾害预警提示】中央气象台2023年5月3日报告，我省南部将持续高温天气，请各部门注意采取相应措施。发布单位：自治区预警中心',
						receipt: '已叫应'
			}
		}
	}
</script>

<style scoped> 
p{
	font-size:16px;
}
i{
	background-color: aliceblue;
	padding: 2px 5px;
}
.inner{
	padding:25px 25px;
}
</style>