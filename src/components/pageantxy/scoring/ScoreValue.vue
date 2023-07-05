<script setup>
import { hexToRgb } from '@layouts/utils'
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const props = defineProps({
  score: {
    type: [Number, String],
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const series = computed(() => [
  props.score,
  (props.max - props.score),
])

const computedColor = computed(() => { 
  if (props.score < (props.max - 40))
    return '#ab0c2e'
    
  else if (props.score < (props.max - 30))
    return '#8f6b11'
    
  else if (props.score < (props.max - 20))
    return '#ebab0c'
  
  return '#c26de3'
})

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${ hexToRgb(currentTheme.success) },0.2)`
  const headingColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`

  const chartColors = {
    donut: {
      value: computedColor.value,
      total: '#28c76fb3',
    },
  }
  
  return {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    labels: [
      'Value',
      'Total',
    ],
    colors: [
      chartColors.donut.value,
      chartColors.donut.total,
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${ parseInt(val) }%`
      },
    },
    legend: { show: false },
    tooltip: {
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let label = w.config.labels[seriesIndex]
        
        return `${label}: ${(label == 'Total') ? props.max : series[seriesIndex] }`
      },
    },
    grid: {
      padding: {
        top: 5,
        right: -20,
        left: -20,
      },
    },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            show: true,
            value: {
              fontSize: '1.375rem',
              fontFamily: 'Public Sans',
              color: headingColor,
              fontWeight: 600,
              offsetY: -15,
              formatter(val) {
                return `${ parseInt(val) }%`
              },
            },
            name: {
              offsetY: 20,
              fontFamily: 'Public Sans',
            },
            total: {
              show: true,
              showAlways: true,
              color: currentTheme.success,
              fontSize: '.8125rem',
              label: 'Score',
              fontFamily: 'Public Sans',
              formatter(cfg) {
                return cfg.config.series[0]
              },
            },
          },
        },
      },
    },
  }
})
</script>

<template>
  <VueApexCharts
    class="d-flex flex-row justify-space-center"
    :options="chartOptions"
    :series="series"
    :height="100"
    :width="100"
  />
</template>
