import { Component, OnInit } from '@angular/core';

interface FAQItem {
  question: string;
  answer?: string;
  subItems?: FAQItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  faqs: FAQItem[] = [
    {
      question: "1. ¿Cómo activo mi SIM de DIRECTV?",
      answer: `Para comenzar a disfrutar de todos los beneficios que DIRECTV Móvil, debes activar tu SIM card, siguiendo los siguientes pasos.
Directamente desde tu equipo móvil con las bandas abiertas siguiendo estos pasos:
a) Con tu teléfono móvil apagado, inserta tu SIM, prende tu teléfono y espera que reconozca la señal de DIRECTV.
b) Desactiva tu Wi‑Fi y activa los datos de tu celular.
c) Inserta tu SIM DIRECTV en tu celular.
d) Ingresa a la URL <a href="http://portal.directv.com.co" target="_blank">portal.directv.com.co </a>.
e) Sigue las instrucciones en pantalla.
f) Una vez activa tu SIM, obtendrás tu número de celular.
En nuestra página web www.directvla.com (menú servicios opción telefonía móvil), puedes consultar los planes disponibles para ti.`,
      expanded: false
    },
    {
      question: "2. Compra planes",
      subItems: [
        {
          question: "2.1 ¿Dónde puedo pagar mi línea DIRECTV?",
          answer: `a) En nuestra página web, en el siguiente link: <a href="https://directv.paymentez.com/pospago#no-back-button" target="_blank">directv.paymentez.com/pospago#no-back-button </a>.
b) En cualquiera de los puntos de pago de nuestros aliados. Consulta nuestra red de aliados en el correo de bienvenida que te llegó al momento de la compra o en el *888 opción 4.`
        },
        {
          question: "2.2 ¿Hay un monto de pago mínimo?",
          answer: `Sí, mínimo el valor de tu plan contratado. La compra del plan la puedes realizar llamando al #322 y realizando el pago en nuestra página web <a href="https://directv.paymentez.com/pospago#no-back-button" target="_blank">directv.paymentez.com/pospago#no-back-button </a>, o en cualquiera de los puntos de pago de nuestros aliados. Servicio operado por LOV TELECOMUNICACIONES S.A.S.`
        }
      ],
      expanded: false
    },
    {
      question: "3. Planes y Paquetes",
      subItems: [
        {
          question: "3.1 ¿Qué es un plan DIRECTV?",
          answer: `Es un conjunto de recursos precargados de minutos, datos y mensajes de texto con una vigencia determinada. Al activar un plan, podrás disfrutar de todos los recursos que incluye hasta que te los consumas en su totalidad o hasta la vigencia del plan, lo que ocurra primero.
Conoce nuestros planes en www.directvla.com (menú servicios opción telefonía móvil), donde puedes consultar los planes disponibles.
Nuestros planes DIRECTV son recurrentes siempre y cuando realices a tiempo el pago mensual de tu línea para cubrir el valor total del plan. Una vez hayas comprado un plan, quedas inscrito en este.<br>
 Conoce más acerca de los términos y condiciones de la oferta comercial en <a href="https://www.lov.com.co/directv/TyC/terminos_y_condiciones_de_la_oferta_comercial.pdf" target="_blank">terminos_y_condiciones_de_la_oferta</a>`
        }
      ],
      expanded: false
    },
    {
      question: "4. Saldo",
      subItems: [
        {
          question: "4.1 ¿Dónde consulto mi saldo? ¿Tiene costo?",
          answer: `Puedes consultar tu saldo marcando desde tu línea móvil DIRECTV al IVR *888 o a nuestro canal USSD *888# opción 2. Ninguno de estos medios de consulta tiene costo.
Si necesitas más datos para seguir navegando, puedes adquirir otro plan en <a href="https://directv.paymentez.com/pospago#no-back-button" target="_blank">directv.paymentez.com/pospago#no-back-button </a> digitando tu número de celular.`
        }
      ],
      expanded: false
    },
    {
      question: "5. Consultas generales",
      subItems: [
        {
          question: "5.1 ¿Cómo consigo una SIM CARD DIRECTV?",
          answer: `Puedes llamar a nuestro centro de ventas DIRECTV desde celular #332 y ponerte en contacto con nuestros asesores.`
        },
        {
          question: "5.2 ¿DIRECTV tiene el servicio de Roaming Internacional?",
          answer: `En estos momentos, en tu línea móvil DIRECTV no ofrecemos el servicio de Roaming Internacional.`
        },
        {
          question: "5.3  ¿Cómo puedo configurar el buzón de voz?",
          answer: `Desde tu línea DIRECTV marca *123 para configurar y consultar tu buzón de voz DIRECTV. Consultar tu buzón de voz no tiene ningún costo; simplemente marcas *123 y listo!`
        },
        {
          question: "5.4 ¿Qué pasa si no utilizo mi línea DIRECTV por mucho tiempo?",
          answer: `Si tu línea móvil DIRECTV no presenta actividad por 90 días seguidos, tu línea será cancelada, pero te haremos un aviso antes de la cancelación a través de un SMS.`
        },
        {
          question: "5.5 ¿Qué quiere decir “actividad”?",
          answer: `“Actividad” se refiere a hacer o recibir llamadas, enviar SMS, iniciar una sesión de datos, o hacer un pago de tu plan en tu línea móvil DIRECTV.`
        },
        {
          question: "5.6 ¿Qué significa “Cancelar mi línea DIRECTV”?",
          answer: `Significa cancelar tu línea móvil DIRECTV, lo cual implica que tu SIM DIRECTV dejará de funcionar. Servicio operado por LOV TELECOMUNICACIONES S.A.S.`
        },
        {
          question: "5.7 ¿Qué debo hacer en caso de que me hurten o se me extravíe mi SIM DIRECTV y mi equipo?",
          answer: `Es muy importante que, en caso de hurto o extravío, nos notifiques inmediatamente para que podamos bloquear el servicio de tu línea móvil DIRECTV y de tu equipo. Marca desde otra línea móvil DIRECTV al *888 (opción 4), o desde cualquier teléfono al 018000423690. Tu servicio quedará suspendido inmediatamente. Una vez suspendida tu línea, te recomendamos comprar una nueva SIM DIRECTV para realizar el proceso de reposición de SIM a través de nuestro centro de servicio al cliente y así puedas recuperar tu número, los recursos (saldo, planes y paquetes activos) que tenías disponibles y continuar disfrutando de nuestros servicios.`
        },
        {
          question: "5.8 ¿Dónde puedo hacer mis reclamaciones?",
          answer: `Las reclamaciones las puedes hacer por los canales de atención telefónico marcando desde tu línea móvil DIRECTV al *888 (opción 4), o desde cualquier teléfono al 018000423690.
También tienes el recurso de PQR, opción que puedes encontrar en el siguiente link: <a href="https://www.lov.com.co/directv/atencion_al_usuario/procedimiento_y_tramites_pqr.pdf" target="_blank">Procedimiento y Trámites PQR</a> y al formulario: <a href="https://www.lov.com.co/directv/claim" target="_blank">www.lov.com.co/directv/claim</a>.
Ten presente que el servicio es operado por LOV TELECOMUNICACIONES S.A.S.`
        },
        {
          question: "5.9 ¿Quién es el prestador del servicio?",
          answer: `El servicio de telefonía móvil es prestado por LOV Telecomunicaciones S. A. S., en virtud de un acuerdo comercial suscrito con DIRECTV Colombia Ltda., para su ofrecimiento bajo la marca DIRECTV. El servicio de telefonía móvil es un producto distinto e independiente al servicio de televisión e internet prestado por DIRECTV Colombia Ltda.`
        },
        {
          question: "5.10 ¿Puedo usar mi SIM DIRECTV Móvil en cualquier equipo terminal móvil?",
          answer: `Sí, siempre y cuando tu equipo terminal móvil esté registrado, no esté reportado como perdido o robado, y esté homologado en Colombia ante la CRC (Comisión de Regulación de Comunicaciones).
Debes tener en cuenta que tu equipo móvil soporta tecnología HSDPA+, UMTS en la banda 1900 MHz y LTE en la banda (AWS)-(1700/2100).`
        },
        {
          question: "5.11 ¿Cómo hacer que mis datos móviles duren más?",
          answer: `Sigue estos consejos para optimizar tu consumo de datos y evitar gastos innecesarios:
• Usa WiFi siempre que sea posible: Descarga aplicaciones, fotos y videos solo cuando estés conectado a una red WiFi.
• Controla las actualizaciones: Desactiva la descarga automática de actualizaciones y aplicaciones desde los ajustes de tu dispositivo.
• Elimina lo que no necesitas: Desinstala las aplicaciones que no usas para evitar consumo de datos en segundo plano.
Aplicando estos sencillos tips, podrás aprovechar mejor tus datos móviles.`
        },
        {
          question: "5.12 ¿La reposición de mi SIM DIRECTV tiene algún costo?",
          answer: `NO, si necesitas cambiarla por daños ajenos a ti, solo debes comunicarte con *888 opción 4 y seguir las indicaciones.
Tu nueva SIM DIRECTV conservará los recursos que tenías en la anterior, manteniendo el tiempo de vigencia del plan. Ten en cuenta que, si el cambio se debe a pérdida o robo, es posible que alguien haya consumido tu saldo antes del bloqueo de la línea, por lo que no podremos hacernos responsables por ese saldo extraviado.
Además, conservarás el mismo número de línea que tenías en tu SIM anterior. Servicio operado por LOV TELECOMUNICACIONES S.A.S.`
        },
        {
          question: "5.13 ¿Cómo puedo cancelar mi línea DIRECTV?",
          answer: `Puedes cancelar tu línea en cualquier momento, pero ten en cuenta que debes ser el titular y que, una vez cancelada, perderás el número de forma definitiva.
Si decides continuar con la cancelación, comunícate desde tu línea DIRECTV marcando *888 opción 4, o desde cualquier teléfono al 018000423690.`
        },
        {
          question: "5.14 ¿Cómo registrar mi equipo?",
          answer: `Muy sencillo, lo podrás hacer registrando tu equipo marcando desde la línea móvil DIRECTV *888 opción 3.`
        },
        {
          question: "5.15 ¿Qué hago en caso de pérdida o robo de dispositivo?",
          answer: `Para reportar la pérdida o robo del celular, podrá hacerlo por vía telefónica al 018000423690 o ingresando al link <a href="https://www.lov.com.co/directv/perdida_o_hurto" target="_blank"> https://www.lov.com.co/directv/perdida_o_hurto </a>, una vez se comunique solicite el bloqueo del aparato y la suspensión de la línea telefónica.<br>
          También debe denunciar si es robo en la plataforma de la Policía Nacional, <a href="https://urldefense.com/v3/__https://adenunciar.policia.gov.co/adenunciar/frm_salas.aspx__;!!ChWRnQ646yhd!WwABEa4HoyzPPyDU3YcBzfJLjTDMh3ncfAf4a9GHEEyQVaIUIljRA33-JIBbTitNzW2cUVBiX7wkpS_wPK06Dp0h$" target="_blank">adenunciar.policia.gov.co </a> o en cualquier estación de Policía`
        }
      ],
      expanded: false
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  toggleFAQ(index: number): void {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }
}
