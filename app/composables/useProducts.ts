export type Product = {
  id: string
  icon: string
  title: string
  description: string
  tagsLabel: string
  tags: string[]
  to: string
}

export function useProducts() {
  const { t, tm, rt } = useI18n()

  const products = computed<Product[]>(() => [
    {
      id: 'garantia',
      icon: 'i-lucide-shield',
      title: t('cotation.products.garantia'),
      description: t('cotation.products.garantia_desc'),
      tagsLabel: t('cotation.products.garantia_tags_label'),
      tags: (tm('cotation.products.garantia_tags') as unknown[]).map(i => rt(i as any)),
      to: '/quotes/create?product=garantia',
    },
    {
      id: 'empresarial',
      icon: 'i-lucide-building-2',
      title: t('cotation.products.empresarial'),
      description: t('cotation.products.empresarial_desc'),
      tagsLabel: t('cotation.products.empresarial_tags_label'),
      tags: (tm('cotation.products.empresarial_tags') as unknown[]).map(i => rt(i as any)),
      to: '/quotes/create?product=empresarial',
    },
    {
      id: 'vida',
      icon: 'i-lucide-heart',
      title: t('cotation.products.vida'),
      description: t('cotation.products.vida_desc'),
      tagsLabel: t('cotation.products.vida_tags_label'),
      tags: (tm('cotation.products.vida_tags') as unknown[]).map(i => rt(i as any)),
      to: '/quotes/create?product=vida',
    },
  ])

  const search = ref('')

  const filteredProducts = computed(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return products.value
    return products.value.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
    )
  })

  return { products, search, filteredProducts }
}
