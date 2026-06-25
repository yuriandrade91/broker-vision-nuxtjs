import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MetricCard from '../../app/components/MetricCard.vue'

const defaultMetric = {
  id: 'test-metric',
  icon: 'i-lucide-trending-up',
  label: 'Cotações Ativas',
  value: 'R$ 1.847',
  subtitle: 'Em andamento no sistema',
  delta: 12,
}

const stubs = {
  UIcon: { template: '<span :data-name="name" />', props: ['name'] },
}

describe('MetricCard', () => {
  it('renders label and value', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: defaultMetric },
      global: { stubs },
    })
    expect(wrapper.text()).toContain(defaultMetric.label)
    expect(wrapper.text()).toContain(defaultMetric.value)
  })

  it('renders subtitle', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: defaultMetric },
      global: { stubs },
    })
    expect(wrapper.text()).toContain(defaultMetric.subtitle)
  })

  it('shows positive delta with + sign', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: { ...defaultMetric, delta: 5 } },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('+5%')
  })

  it('shows negative delta without + sign', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: { ...defaultMetric, delta: -3 } },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('-3%')
  })

  it('applies green styling for positive delta', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: { ...defaultMetric, delta: 10 } },
      global: { stubs },
    })
    const badge = wrapper.find('span.rounded-full')
    expect(badge.classes()).toContain('text-green-600')
  })

  it('applies red styling for negative delta', () => {
    const wrapper = mount(MetricCard, {
      props: { metric: { ...defaultMetric, delta: -5 } },
      global: { stubs },
    })
    const badge = wrapper.find('span.rounded-full')
    expect(badge.classes()).toContain('text-red-600')
  })
})
