<template>
  <a-card title="综合预警指数">
    <div id="echartsMain" style="height: 300px;"></div>
  </a-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "index-echarts",
  data() {
    return {};
  },
  mounted() {
    this.initEchart();
  },
  methods: {
    initEchart() {
      let chartDom = document.getElementById("echartsMain");
      let myChart = echarts.init(chartDom);
      myChart.setOption({
        legend: {
          data: ["红", "橙", "黄"],
          bottom: '10',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          axisPointer: {
            type: 'cross',
            animation: true
          },
          backgroundColor: 'rgba(255, 255, 255, .5)'
        },
        radar: {
          shape: 'circle',
          indicator: [
            { name: "地震", max: 80 },
            { name: "森林草原火灾", max: 80 },
            { name: "水旱", max: 80 },
            { name: "地质", max: 80 },
            { name: "气象", max: 80 }
          ],
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [10, 40, 20, 60, 10, 60],
                name: "红",
				lineStyle:{
					color:'red'
				},
				itemStyle: { 
					color:'red'
				}
              },
              {
                value: [50, 14, 28, 26, 42, 21],
                name: "橙",
				lineStyle:{
					color:'#f66d05'
				},
				itemStyle: { 
					color:'#f66d05'
				}
              },
              {
                value: [60, 20, 43, 73, 12, 80],
                name: "黄",
				lineStyle:{
					color:'#f7ad00'
				},
				itemStyle: { 
					color:'#f7ad00'
				}
              },
            ],
          },
        ],
      });
    },
  },
};
</script>
