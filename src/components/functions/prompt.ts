import { createVNode, render } from 'vue'
import SuccessPrompt from '../prompts/successPrompt.vue'
import ErrorPrompt from '../prompts/errorPrompt.vue'
import WarningPrompt from '../prompts/warningPrompt.vue'
import InfoPrompt from '../prompts/infoPrompt.vue'

const componentMap = {
  success: SuccessPrompt,
  error: ErrorPrompt,
  warning: WarningPrompt,
  info: InfoPrompt
}

export const showPrompt = (type: 'success' | 'error' | 'warning' | 'info', message: string, subText?: string) => {
  // eslint-disable-next-line security/detect-object-injection
  const Comp = componentMap[type]
  const vnode = createVNode(Comp, { message, subText })
  const container = document.createElement('div')
  document.body.appendChild(container)
  render(vnode, container)
  setTimeout(() => {
    render(null, container)
    document.body.removeChild(container)
  }, 5000)
}
