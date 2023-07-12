<template>
  <a-card title="综合预警指数">
    <div id="echartsMain" style="height: 300px;"></div>
  </a-card>
</template>

<script>
import * as echarts from 'echarts'
import {getBasicData, getWarningData} from "@/api/login";
export default {
  name: "index-echarts",
  data() {
    return {};
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      const t = this
      const res = await getWarningData()
      if(res.data.code == 100){
        let data = res.data.data
        let redData = [0,0,0,0,0,0]
        let orangeData = [0,0,0,0,0,0]
        let yellowData = [0,0,0,0,0,0]
        let blueData = [0,0,0,0,0,0]
        if(data[1] && data[1].length>0){
          for(let i of data[1]){
            redData[i.disasterType - 1] = i.count
          }
        }
        if(data[2] && data[2].length>0){
          for(let i of data[2]){
            orangeData[i.disasterType - 1] = i.count
          }
        }
        if(data[3] && data[3].length>0){
          for(let i of data[3]){
            yellowData[i.disasterType - 1] = i.count
          }
        }
        if(data[4] && data[4].length>0){
          for(let i of data[4]){
            blueData[i.disasterType - 1] = i.count
          }
        }
        let whole = redData.concat(orangeData,yellowData,blueData)
        let maxNum = Math.max(...whole)
        t.initEchart(redData,orangeData,yellowData,blueData,maxNum);
      }else{
        this.$message.error(res.data.msg)
      }
    },
    initEchart(red,orange,yellow,blue,maxNum) {
      let chartDom = document.getElementById("echartsMain");
      let myChart = echarts.init(chartDom);
      myChart.setOption({
        legend: {
          data: ["红", "橙", "黄", "蓝"],
          bottom: 0,
          icon: 'circle'
        },
        grid:{
          bottom: "50%"
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
          center: ['50%','46%'],
          nameGap: 10,
          indicator: [
            { name: "地震", max: maxNum },
            { name: "洪涝", max: maxNum },
            { name: "气象", max: maxNum },
            { name: "泥石流", max: maxNum },
            { name: "水旱", max: maxNum },
            { name: "森林草原火灾", max: maxNum }
          ],
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: red,
                name: "红",
                lineStyle:{
                  color:'red'
                },
                itemStyle: {
                  color:'red'
                },
                areaStyle:{
                  color: 'red',
                  opacity: 0.2
                }
              },
              {
                value: orange,
                name: "橙",
                lineStyle:{
                  color:'#f66d05'
                },
                itemStyle: {
                  color:'#f66d05'
                },
                areaStyle:{
                  color: '#f66d05',
                  opacity: 0.2
                }
              },
              {
                value: yellow,
                name: "黄",
                lineStyle:{
                  color:'#f7ad00'
                },
                itemStyle: {
                  color:'#f7ad00'
                },
                areaStyle:{
                  color: '#f7ad00',
                  opacity: 0.2
                }
              },
              {
                value: blue,
                name: "蓝",
                lineStyle:{
                  color:'#1890ff'
                },
                itemStyle: {
                  color:'#1890ff'
                },
                areaStyle:{
                  color: '#1890ff',
                  opacity: 0.2
                }
              }
            ],
          },
        ],
      });
    },
  },
};
</script>
