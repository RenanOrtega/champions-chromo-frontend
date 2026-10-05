import { createOrder } from "@/clients/order";
import OrderSummary from "@/components/OrderSummary";
import Page from "@/components/Page";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { whatsAppUrl } from "@/lib/contact";
import { AlertCircle, CircleCheck, Loader2, MessageCircle, ShoppingBag } from "lucide-react";
import { ChangeEvent, FormEvent, InputHTMLAttributes, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface AddressInfo {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    complement: string;
    city: string;
    state: string;
    name: string;
    email: string;
}

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

interface FormData {
    addressInfo: AddressInfo;
}

interface ValidationErrors {
    name?: string;
    email?: string;
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
    className?: string;
    trailing?: React.ReactNode;
}

const Field = ({ id, label, error, className = '', trailing, ...inputProps }: FieldProps) => (
    <div className={className}>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
        </label>
        <div className="relative">
            <input
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`h-11 w-full rounded-md border bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 read-only:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 ${error ? 'border-red-500' : 'border-slate-300'}`}
                {...inputProps}
            />
            {trailing}
        </div>
        {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
);

const OrderPage = () => {
    const { itens, clearCart, finalTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');
    const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
    const [cepError, setCepError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<FormData>({
        addressInfo: {
            postalCode: '',
            street: '',
            number: '',
            neighborhood: '',
            complement: '',
            city: '',
            state: '',
            name: '',
            email: ''
        },
    });

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        // Validação do nome
        if (!formData.addressInfo.name.trim()) {
            errors.name = 'Informe seu nome';
        }

        // Validação do email
        if (!formData.addressInfo.email.trim()) {
            errors.email = 'Informe seu email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addressInfo.email)) {
            errors.email = 'Confira o email, o formato parece incorreto';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateOrder = async (e?: FormEvent) => {
        e?.preventDefault();

        // Validar formulário antes de prosseguir
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError('');
        try {
            const orderSummaryRequest = {
                albums: itens.map(item => ({
                    albumId: item.album.id,
                    schoolId: item.album.schoolId,
                    albumName: item.album.name,
                    stickers: item.stickers.map(sticker => ({
                        type: sticker.type,
                        number: sticker.number,
                        quantity: sticker.quantity
                    }))
                })),
                customer: {
                    name: formData.addressInfo.name,
                    email: formData.addressInfo.email,
                    address: formData.addressInfo
                },
                priceTotal: finalTotal()
            };

            const response = await createOrder(orderSummaryRequest);

            setOrderId(response.id);
            setOrderCreated(true);
            clearCart(); // limpa o carrinho após o pedido
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            setSubmitError('Não foi possível gerar o pedido. Seus dados continuam aqui, tente de novo.');
        } finally {
            setLoading(false);
        }
    };

    const whatsAppOrderUrl = whatsAppUrl(
        `Olá, meu nome é ${formData.addressInfo.name}\n\nGostaria de finalizar o pagamento e envio do meu pedido.\n\nPedido ID: ${orderId}\n\nAguardo o contato para prosseguir.`
    );

    const formatCep = (value: string): string => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
    };

    const fetchAddressByCep = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setIsLoadingCep(true);
        setCepError('');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data: ViaCepResponse = await response.json();

            if (data.erro) {
                setCepError('CEP não encontrado');
                return;
            }

            setFormData(prev => ({
                ...prev,
                addressInfo: {
                    ...prev.addressInfo,
                    street: data.logradouro,
                    complement: data.complemento,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }
            }));
        } catch (error) {
            setCepError('Não foi possível buscar o CEP. Preencha o endereço manualmente.');
            console.error('Erro ao buscar o CEP:', error);
        } finally {
            setIsLoadingCep(false);
        }
    };

    // Efeito para buscar o endereço quando o CEP for preenchido completamente
    useEffect(() => {
        const postalCode = formData.addressInfo.postalCode.replace(/\D/g, '');
        if (postalCode.length === 8) {
            fetchAddressByCep(postalCode);
        }
    }, [formData.addressInfo.postalCode]);

    const handleInputChange = (section: keyof FormData, field: string, value: string) => {
        // Aplicar formatação específica para alguns campos
        let formattedValue = value;

        if (field === 'postalCode') {
            formattedValue = formatCep(value);
        }

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: formattedValue
            }
        }));

        // Limpar erro de validação quando o usuário começar a digitar
        if (field === 'name' && validationErrors.name) {
            setValidationErrors(prev => ({ ...prev, name: undefined }));
        }
        if (field === 'email' && validationErrors.email) {
            setValidationErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const fieldProps = (field: keyof AddressInfo) => ({
        value: formData.addressInfo[field],
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', field, e.target.value),
    });

    if (orderCreated) {
        return (
            <Page>
                <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center sm:p-8">
                    <CircleCheck className="mx-auto size-11 text-green-600" strokeWidth={1.5} />
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Pedido gerado</h1>
                    <p className="mt-4 text-sm text-slate-600">Número do pedido</p>
                    <p className="mt-0.5 select-all break-all font-mono text-base font-semibold text-slate-900">{orderId}</p>

                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <p className="font-semibold text-slate-900">Falta só um passo</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            Chame a gente no WhatsApp para combinar o pagamento e o envio. O número do pedido já vai na mensagem.
                        </p>
                        <a
                            href={whatsAppOrderUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-green-700 text-base font-semibold text-white transition-colors hover:bg-green-800"
                        >
                            <MessageCircle className="size-5" />
                            Chamar no WhatsApp
                        </a>
                    </div>
                </div>
            </Page>
        );
    }

    if (itens.length === 0) {
        return (
            <Page>
                <StateMessage
                    icon={ShoppingBag}
                    title="Seu carrinho está vazio"
                    description="Adicione figurinhas ao carrinho antes de finalizar o pedido."
                >
                    <Button asChild size="lg">
                        <Link to="/schools">Escolher escola</Link>
                    </Button>
                </StateMessage>
            </Page>
        );
    }

    return (
        <Page showBack title="Finalizar pedido" subtitle="O pagamento e o envio são combinados pelo WhatsApp depois de gerar o pedido.">
            <div className="grid items-start gap-6 lg:grid-cols-3">
                <form
                    id="order-form"
                    noValidate
                    onSubmit={handleCreateOrder}
                    className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2"
                >
                    <fieldset>
                        <legend className="text-base font-semibold text-slate-900">Seus dados</legend>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field
                                id="name"
                                label="Nome *"
                                type="text"
                                autoComplete="name"
                                required
                                error={validationErrors.name}
                                {...fieldProps('name')}
                            />
                            <Field
                                id="email"
                                label="Email *"
                                type="email"
                                autoComplete="email"
                                required
                                error={validationErrors.email}
                                {...fieldProps('email')}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="mt-6 border-t border-slate-200 pt-6">
                        <legend className="float-left mb-4 w-full text-base font-semibold text-slate-900">Endereço de entrega</legend>
                        <div className="clear-both grid grid-cols-6 gap-4">
                            <Field
                                id="cep"
                                label="CEP"
                                type="text"
                                inputMode="numeric"
                                autoComplete="postal-code"
                                maxLength={9}
                                placeholder="00000-000"
                                error={cepError}
                                className="col-span-6 sm:col-span-2"
                                trailing={isLoadingCep && (
                                    <Loader2 className="absolute right-3 top-3 size-5 animate-spin text-primary-600" />
                                )}
                                {...fieldProps('postalCode')}
                            />
                            <Field
                                id="street"
                                label="Rua"
                                type="text"
                                autoComplete="address-line1"
                                readOnly={isLoadingCep}
                                className="col-span-4 sm:col-span-3"
                                {...fieldProps('street')}
                            />
                            <Field
                                id="number"
                                label="Número"
                                type="text"
                                inputMode="numeric"
                                className="col-span-2 sm:col-span-1"
                                {...fieldProps('number')}
                            />
                            <Field
                                id="complement"
                                label="Complemento"
                                type="text"
                                autoComplete="address-line2"
                                readOnly={isLoadingCep}
                                className="col-span-6 sm:col-span-3"
                                {...fieldProps('complement')}
                            />
                            <Field
                                id="neighborhood"
                                label="Bairro"
                                type="text"
                                readOnly={isLoadingCep}
                                className="col-span-6 sm:col-span-3"
                                {...fieldProps('neighborhood')}
                            />
                            <Field
                                id="city"
                                label="Cidade"
                                type="text"
                                autoComplete="address-level2"
                                readOnly={isLoadingCep}
                                className="col-span-4"
                                {...fieldProps('city')}
                            />
                            <Field
                                id="state"
                                label="Estado"
                                type="text"
                                autoComplete="address-level1"
                                readOnly={isLoadingCep}
                                className="col-span-2"
                                {...fieldProps('state')}
                            />
                        </div>
                    </fieldset>
                </form>

                <div className="lg:sticky lg:top-24">
                    <OrderSummary
                        showCouponInput={false}
                    />
                    {submitError && (
                        <p role="alert" className="mt-4 flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            {submitError}
                        </p>
                    )}
                    <Button
                        type="submit"
                        form="order-form"
                        disabled={loading}
                        className="mt-4 h-12 w-full text-base"
                    >
                        {loading && <Loader2 className="size-5 animate-spin" />}
                        {loading ? "Gerando pedido" : "Gerar pedido"}
                    </Button>
                </div>
            </div>
        </Page>
    );
};

export default OrderPage;
