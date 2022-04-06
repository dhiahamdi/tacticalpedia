export default class TranslateService {

    translations;

    constructor(){
        this.translations = {
            'Hi': {
                'en': 'Hi',
                'it': 'Ciao',
                'pt': 'Oi'
            },
            'Thank you for signup. Please verify your email address to activate your account.': {
                'en': 'Thank you for signup. Please verify your email address to activate your account.',
                'it': 'Grazie per esserti registrato. Verifica questa email per attivare il tuo account.',
                'pt': 'Obrigado por se inscrever. Por favor, verifique seu endereço de e-mail para ativar sua conta.'
            },
            'CONFIRM E-MAIL ADDRESS': {
                'en': 'CONFIRM E-MAIL ADDRESS',
                'it': 'CONFERMA INDIRIZZO E-MAIL',
                'pt': 'CONFIRME O ENDEREÇO DE E-MAIL'
            },
            'If you ignore this message, your account will not be activated.': {
                'en': 'If you ignore this message, your account will not be activated.',
                'it': 'Se ignori questo messaggio, il tuo account non sarà attivato.',
                'pt': 'Se você ignorar esta mensagem, sua conta não será ativada.'
            },
            'If you did not signup to Tacticalpedia and this is a mistake': {
                'en': 'If you did not request a password reset',
                'it': 'Se non ti sei registrato su Tacticalpedia e pensi che questo sia un errore',
                'pt': 'Se você não se inscreveu na Tacticalpedia e isso é um erro'
            },
            'let us know': {
                'en': 'let us know',
                'it': 'faccelo sapere',
                'pt': 'nos informe'
            },
            'change your password': {
                'en': 'change your password',
                'it': 'cambia la tua password',
                'pt': 'mude sua senha'
            },
            'We got a request to reset your password.': {
                'en': 'We got a request to reset your password.',
                'it': 'Abbiamo ricevuto una richiesta di cambio password.',
                'pt': 'Recebemos um pedido para redefinir sua senha.'
            },
            'RESET PASSWORD': {
                'en': 'RESET PASSWORD',
                'it': 'CAMBIA PASSWORD',
                'pt': 'REDEFINIR SENHA'
            },
            'If you ignore this message, your password will not be changed.': {
                'en': 'If you ignore this message, your password will not be changed.',
                'it': 'Se ignori questo messaggio, la tua password non verrà cambiata.',
                'pt': 'Se você ignorar esta mensagem, sua senha não será alterada.'
            },
            'If you did not request a password reset': {
                'en': 'If you did not request a password reset',
                'it': 'Se non hai richiesto un cambio password',
                'pt': 'Se você não solicitou uma redefinição de senha'
            },
            'Update your payment method': {
                'en': 'Update your payment method',
                'it': 'Aggiorna il tuo metodo di pagamento',
                'pt': 'Atualize sua forma de pagamento'
            },
            'We were not able to collect your last payment for your subscription. Please update your payment method or you will lose access to Tacticalpedia and your library.': {
                'en': 'We were not able to collect your last payment for your subscription. Please update your payment method or you will lose access to Tacticalpedia and your library.',
                'it': 'Non siamo stati in grado di riscuotere l\'ultimo pagamento per l\'abbonamento. Aggiorna il tuo metodo di pagamento o perderai l\'accesso a Tacticalpedia e alla tua libreria.',
                'pt': 'Não foi possível coletar o último pagamento de sua assinatura. Atualize seu método de pagamento ou você perderá o acesso ao Tacticalpedia e sua biblioteca.'
            },
            'MANAGE SUBSCRIPTION': {
                'en': 'MANAGE SUBSCRIPTION',
                'it': 'GESTISCI ABBONAMENTO',
                'pt': 'GERENCIAR ASSINATURA'
            },
            'If you already updated your payment method, feel free to ignore this message.': {
                'en': 'If you already updated your payment method, feel free to ignore this message.',
                'it': 'Se hai già aggiornato il tuo metodo di pagamento, puoi ignorare questo messaggio.',
                'pt': 'Se você já atualizou sua forma de pagamento, ignore esta mensagem.'
            },
            'If you do not have any active subscription on Tacticalpedia': {
                'en': 'If you do not have any active subscription on Tacticalpedia',
                'it': 'Se non hai nessun abbonamento attivo su Tacticalpedia',
                'pt': 'Se você não tiver nenhuma assinatura ativa na Tacticalpedia'
            },
            'contact our support center': {
                'en': 'contact our support center',
                'it': 'contatta il nostro centro di assistenza',
                'pt': 'entre em contato com nosso centro de suporte'
            }
        }
    }


    translate(text: string, lang: string) {

        if(!lang) return text;

        if (this.translations.hasOwnProperty(text)) {
            return this.translations[text][lang];
        } else {
            return text;
        }
    }


}