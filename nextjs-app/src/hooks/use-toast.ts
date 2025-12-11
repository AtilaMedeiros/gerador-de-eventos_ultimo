import { toast as sonnerToast } from "sonner"

type ToastProps = {
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
}

export const useToast = () => {
    const toast = (props: ToastProps | string) => {
        if (typeof props === 'string') {
            sonnerToast(props)
            return
        }

        const { title, description, variant } = props

        if (variant === 'destructive') {
            sonnerToast.error(title || 'Erro', {
                description,
            })
        } else {
            sonnerToast.success(title || 'Sucesso', {
                description,
            })
        }
    }

    return { toast }
}
