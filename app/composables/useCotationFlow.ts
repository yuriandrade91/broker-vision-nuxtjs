import type { CotacaoFormData, StepDefinition, ValidationErrors, PaymentMethod } from '~/types/cotation'
import { tomadores as _tomadores } from '~/composables/usePolicyholders'

export const STEPS: StepDefinition[] = [
  { number: 1, title: 'cotation.steps.1.title', subtitle: 'cotation.steps.1.subtitle', icon: 'i-lucide-file-text' },
  { number: 2, title: 'cotation.steps.2.title', subtitle: 'cotation.steps.2.subtitle', icon: 'i-lucide-user' },
  { number: 3, title: 'cotation.steps.3.title', subtitle: 'cotation.steps.3.subtitle', icon: 'i-lucide-shield' },
  { number: 4, title: 'cotation.steps.4.title', subtitle: 'cotation.steps.4.subtitle', icon: 'i-lucide-credit-card' },
]

export const PAYMENT_METHOD_IDS = ['boleto', 'pix', 'cartao'] as const

export const PAYMENT_METHODS_ICONS: Record<string, string> = {
  boleto: 'i-lucide-file-text',
  pix: 'i-lucide-zap',
  cartao: 'i-lucide-credit-card',
}

export const PAYMENT_METHODS_RECOMMENDED: Record<string, boolean> = {
  boleto: true,
  pix: false,
  cartao: false,
}

export function searchTomadores(q: string) {
  const term = q.toLowerCase().trim()
  if (term.length < 3) return []
  const digits = term.replace(/\D/g, '')
  return _tomadores.value
    .filter(t =>
      t.nome.toLowerCase().includes(term) ||
      (digits.length >= 3 && t.cnpj.replace(/\D/g, '').includes(digits)),
    )
    .map(t => ({ nome: t.nome, cnpj: t.cnpj }))
}

const MOCK_CEPS: Record<string, { cidade: string; uf: string; logradouro: string }> = {
  '01310100': { cidade: 'São Paulo', uf: 'SP', logradouro: 'Av. Paulista, 1578' },
  '20040020': { cidade: 'Rio de Janeiro', uf: 'RJ', logradouro: 'Av. Rio Branco, 156' },
  '30112000': { cidade: 'Belo Horizonte', uf: 'MG', logradouro: 'Av. Afonso Pena, 1000' },
  '80010010': { cidade: 'Curitiba', uf: 'PR', logradouro: 'R. XV de Novembro, 500' },
  '90010080': { cidade: 'Porto Alegre', uf: 'RS', logradouro: 'Av. Borges de Medeiros, 200' },
}

const DEFAULT_FORM: CotacaoFormData = {
  tomadorSearch: '',
  nomeTomador: '',
  cnpjTomador: '',
  produto: '',
  modalidade: '',
  acrescimo: '',
  valorTotalIS: '',
  dataInicio: '',
  dataFim: '',
  agravo: '',
  comissao: 25.5,
  seguradoNome: '',
  seguradoCnpjCpf: '',
  seguradoEmail: '',
  seguradoTelefone: '',
  seguradoCep: '',
  seguradoCidadeUF: '',
  seguradoEndereco: '',
  riscoObjeto: '',
  riscoNumeroProcesso: '',
  riscoValorSegurado: '',
  riscoLocal: '',
  riscoInicioVigencia: '',
  riscoFimVigencia: '',
  riscoObservacoes: '',
  metodoPagamento: 'boleto',
}

export function useCotationFlow() {
  const { t } = useI18n()
  const currentStep = useState<number>('cotation:step', () => 1)
  const form = useState<CotacaoFormData>('cotation:form', () => ({ ...DEFAULT_FORM }))
  const errors = useState<ValidationErrors>('cotation:errors', () => ({}))
  const numeroCotacao = useState<string>('cotation:numero', () => `CT-${String(Math.floor(Math.random() * 90000) + 10000)}`)

  const currentStepDef = computed(() => STEPS.find(s => s.number === currentStep.value)!)

  const completedSteps = computed(() =>
    ([1, 2, 3, 4] as const).filter(s => s < currentStep.value)
  )

  // ─── Calculated values ───────────────────────────────────────────────
  const valorIS = computed(() => parseCurrencyToNumber(form.value.valorTotalIS))

  const taxaBase = computed(() => {
    if (!form.value.produto || !valorIS.value) return null
    const rates: Record<string, number> = { garantia: 2.5, empresarial: 1.8, vida: 1.2 }
    return rates[form.value.produto] ?? 2.5
  })

  const taxaDisplay = computed(() => {
    if (!taxaBase.value) return null
    const acr = parseFloat(form.value.acrescimo.replace(',', '.')) || 0
    const agr = parseCurrencyToNumber(form.value.agravo)
    return (taxaBase.value + acr + agr * 0.001).toFixed(4).replace('.', ',')
  })

  const premioCalculado = computed(() => {
    if (!valorIS.value || !taxaBase.value) return 0
    const acr = parseFloat(form.value.acrescimo.replace(',', '.')) || 0
    const agr = parseCurrencyToNumber(form.value.agravo)
    const taxa = (taxaBase.value + acr + agr * 0.001) / 100
    return valorIS.value * taxa
  })

  const comissaoCalculada = computed(() => premioCalculado.value * (form.value.comissao / 100))

  const totalAPagar = computed(() => premioCalculado.value * 1.056)

  // ─── Select options ───────────────────────────────────────────────────
  const produtoOptions = computed(() => [
    { label: t('cotation.products.garantia'), value: 'garantia' },
    { label: t('cotation.products.empresarial'), value: 'empresarial' },
    { label: t('cotation.products.vida'), value: 'vida' },
  ])

  const modalidadeOptions = computed(() => {
    const map: Record<string, { label: string; value: string }[]> = {
      garantia: [
        { label: t('cotation.modalities.garantia.judicial'), value: 'judicial' },
        { label: t('cotation.modalities.garantia.trabalhista'), value: 'trabalhista' },
        { label: t('cotation.modalities.garantia.aduaneira'), value: 'aduaneira' },
      ],
      empresarial: [
        { label: t('cotation.modalities.empresarial.incendio'), value: 'incendio' },
        { label: t('cotation.modalities.empresarial.roubo'), value: 'roubo' },
        { label: t('cotation.modalities.empresarial.rc'), value: 'rc' },
      ],
      vida: [
        { label: t('cotation.modalities.vida.morte'), value: 'morte' },
        { label: t('cotation.modalities.vida.invalidez'), value: 'invalidez' },
        { label: t('cotation.modalities.vida.doencas-graves'), value: 'doencas-graves' },
      ],
    }
    return map[form.value.produto] ?? []
  })

  const produtoLabel = computed(() => produtoOptions.value.find(p => p.value === form.value.produto)?.label ?? '')
  const modalidadeLabel = computed(() => modalidadeOptions.value.find(m => m.value === form.value.modalidade)?.label ?? '')

  const paymentMethods = computed(() => PAYMENT_METHOD_IDS.map(id => ({
    id,
    label: t(`cotation.payment.${id}.label`),
    description: t(`cotation.payment.${id}.description`),
    recommended: PAYMENT_METHODS_RECOMMENDED[id],
    icon: PAYMENT_METHODS_ICONS[id],
  })))

  // ─── Validation ────────────────────────────────────────────────────────
  function validateStep1(): ValidationErrors {
    const e: ValidationErrors = {}
    if (!form.value.nomeTomador.trim()) e.nomeTomador = t('cotation.validation.policyholderNameRequired')
    if (!isValidCNPJ(form.value.cnpjTomador)) e.cnpjTomador = t('cotation.validation.cnpjInvalid')
    if (!form.value.produto) e.produto = t('cotation.validation.productRequired')
    if (!form.value.modalidade) e.modalidade = t('cotation.validation.modalityRequired')
    if (!form.value.valorTotalIS) e.valorTotalIS = t('cotation.validation.totalISRequired')
    if (!isValidDate(form.value.dataInicio)) e.dataInicio = t('cotation.validation.dateFormat')
    if (!isValidDate(form.value.dataFim)) e.dataFim = t('cotation.validation.dateFormat')
    return e
  }

  function validateStep2(): ValidationErrors {
    const e: ValidationErrors = {}
    if (!form.value.seguradoNome.trim()) e.seguradoNome = t('cotation.validation.companyNameRequired')
    const doc = form.value.seguradoCnpjCpf.replace(/\D/g, '')
    if (doc.length !== 11 && doc.length !== 14) e.seguradoCnpjCpf = t('cotation.validation.documentInvalid')
    if (!isValidEmail(form.value.seguradoEmail)) e.seguradoEmail = t('cotation.validation.emailInvalid')
    if (form.value.seguradoTelefone.replace(/\D/g, '').length < 10) e.seguradoTelefone = t('cotation.validation.phoneInvalid')
    if (form.value.seguradoCep.replace(/\D/g, '').length < 8) e.seguradoCep = t('cotation.validation.zipCodeInvalid')
    if (!form.value.seguradoEndereco.trim()) e.seguradoEndereco = t('cotation.validation.addressRequired')
    return e
  }

  function validateStep3(): ValidationErrors {
    const e: ValidationErrors = {}
    if (!form.value.riscoObjeto.trim()) e.riscoObjeto = t('cotation.validation.contractObjectRequired')
    if (!form.value.riscoNumeroProcesso.trim()) e.riscoNumeroProcesso = t('cotation.validation.processNumberRequired')
    if (!form.value.riscoValorSegurado) e.riscoValorSegurado = t('cotation.validation.insuredValueRequired')
    if (!form.value.riscoLocal.trim()) e.riscoLocal = t('cotation.validation.riskLocationRequired')
    if (!isValidDate(form.value.riscoInicioVigencia)) e.riscoInicioVigencia = t('cotation.validation.dateInvalid')
    if (!isValidDate(form.value.riscoFimVigencia)) e.riscoFimVigencia = t('cotation.validation.dateInvalid')
    return e
  }

  function validateStep4(): ValidationErrors {
    const e: ValidationErrors = {}
    if (!form.value.metodoPagamento) e.metodoPagamento = t('cotation.validation.paymentMethodRequired')
    return e
  }

  const validators = [validateStep1, validateStep2, validateStep3, validateStep4]

  function validateCurrentStep(): boolean {
    const errs = validators[currentStep.value - 1]?.() ?? {}
    errors.value = errs
    return Object.keys(errs).length === 0
  }

  // ─── Actions ───────────────────────────────────────────────────────────
  function nextStep() {
    if (validateCurrentStep() && currentStep.value < 4) {
      currentStep.value++
    }
  }

  function prevStep() {
    errors.value = {}
    if (currentStep.value > 1) currentStep.value--
  }

  function goToStep(n: number) {
    if (n <= currentStep.value) {
      errors.value = {}
      currentStep.value = n
    }
  }

  function autoFillCEP(rawCep: string) {
    const digits = rawCep.replace(/\D/g, '')
    if (digits.length !== 8) return
    const data = MOCK_CEPS[digits]
    if (data) {
      form.value.seguradoCidadeUF = `${data.cidade} — ${data.uf}`
      form.value.seguradoEndereco = data.logradouro
    } else {
      form.value.seguradoCidadeUF = 'São Paulo — SP'
    }
  }

  function reset() {
    form.value = { ...DEFAULT_FORM }
    errors.value = {}
    currentStep.value = 1
    numeroCotacao.value = `CT-${String(Math.floor(Math.random() * 90000) + 10000)}`
  }

  function loadFromDraft(draft: { numero: string; etapa: number; formData?: Partial<CotacaoFormData> }) {
    form.value = { ...DEFAULT_FORM, ...(draft.formData ?? {}) }
    numeroCotacao.value = draft.numero
    currentStep.value = draft.etapa
    errors.value = {}
  }

  function getDraftData() {
    return {
      numero: numeroCotacao.value,
      etapa: currentStep.value,
      formData: { ...form.value } as Partial<CotacaoFormData>,
    }
  }

  return {
    STEPS,
    PAYMENT_METHODS: paymentMethods,
    currentStep,
    currentStepDef,
    completedSteps,
    form,
    errors,
    numeroCotacao,
    taxaDisplay,
    premioCalculado,
    comissaoCalculada,
    totalAPagar,
    valorIS,
    produtoOptions,
    modalidadeOptions,
    produtoLabel,
    modalidadeLabel,
    nextStep,
    prevStep,
    goToStep,
    autoFillCEP,
    reset,
    loadFromDraft,
    getDraftData,
    validateCurrentStep,
  }
}
