import { Component, OnInit } from '@angular/core';

interface SubQuestion {
  question: string;
  answer: string;
}

interface FAQ {
  title: string;
  subquestions: SubQuestion[];
  open?: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  faqs: FAQ[] = [];

  ngOnInit(): void {
    this.faqs = [
      {
        title: '1. Activación',
        open: false,
        subquestions: [
          {
            question: '1.1 ¿Cómo activo mi SIM de DIRECTV?',
            answer: `Para comenzar a disfrutar de todos los beneficios que DIRECTV Móvil, debes activar tu SIM card siguiendo estos pasos:<br>
a) Inserta tu SIM DIRECTV en tu celular (con el equipo apagado), enciéndelo y espera a que reconozca la señal de DIRECTV.<br>
b) Desactiva el Wi-Fi y activa los datos móviles.<br>
c) Ingresa a la URL <a href="http://portal.directv.com.co" target="_blank">http://portal.directv.com.co</a> y sigue las instrucciones en pantalla.<br>
d) Una vez activa tu SIM, obtendrás tu número de celular.<br>
Adicionalmente, puedes consultar los planes disponibles en <a href="http://www.directvla.com" target="_blank">www.directvla.com</a> en la sección de telefonía móvil.`
          }
        ]
      },
      {
        title: '2. Pagos',
        open: false,
        subquestions: [
          {
            question: '2.1 ¿Dónde puedo pagar mi línea DIRECTV?',
            answer: `a) En nuestra página web: <a href="https://directv.paymentez.com/pospago#no-back-button" target="_blank">https://directv.paymentez.com/pospago#no-back-button</a>.<br>
b) En cualquiera de los puntos de pago de nuestros aliados (consulta la red de aliados en el correo de bienvenida o llama al *888 opción 4).`
          },
          {
            question: '2.2 ¿Hay un monto de pago mínimo?',
            answer: `Sí, el monto mínimo es el valor de tu plan contratado. Puedes realizar el pago llamando al #322, a través de <a href="https://directv.paymentez.com/pospago#no-back-button" target="_blank">nuestro portal de pagos</a> o en los puntos de pago de nuestros aliados.`
          }
        ]
      },
      {
        title: '3. Planes y Paquetes',
        open: false,
        subquestions: [
          {
            question: '3.1 ¿Qué es un plan DIRECTV?',
            answer: `Un plan DIRECTV es un conjunto de recursos precargados (minutos, datos y SMS) con una vigencia determinada. Al activar un plan, disfrutarás de todos sus recursos hasta que se consuman o expire el plan, lo que ocurra primero.<br>
Consulta nuestros planes en <a href="http://www.directvla.com" target="_blank">www.directvla.com</a> en la sección de telefonía móvil.<br>
Los planes son recurrentes siempre que realices el pago mensual a tiempo. Una vez comprado, quedas inscrito en el plan.`
          },
          {
            question: '3.2 ¿Dónde consulto mi saldo? ¿Tiene costo?',
            answer: `Puedes consultar tu saldo marcando al IVR *888 o a través del canal USSD <strong>*888#</strong> (opción 2) desde tu línea DIRECTV. Ninguno de estos métodos tiene costo.`
          }
        ]
      },
      {
        title: '4. Consultas generales',
        open: false,
        subquestions: [
          {
            question: '4.1 ¿Cómo consigo una SIM CARD DIRECTV?',
            answer: `Llama a nuestro centro de ventas DIRECTV al #332 y ponte en contacto con nuestros asesores.`
          },
          {
            question: '4.2 ¿DIRECTV tiene servicio de Roaming Internacional?',
            answer: `Actualmente, en tu línea DIRECTV no ofrecemos servicio de Roaming Internacional.`
          },
          {
            question: '4.3 ¿Cómo puedo configurar el buzón de voz?',
            answer: `Marca *123 desde tu línea DIRECTV para configurar y consultar tu buzón de voz.`
          },
          {
            question: '4.4 ¿Qué pasa si no utilizo mi línea DIRECTV por mucho tiempo?',
            answer: `Si tu línea DIRECTV no presenta actividad durante 90 días consecutivos, será cancelada; sin embargo, te notificaremos por SMS antes de proceder.`
          },
          {
            question: '4.5 ¿Qué quiere decir "actividad"?',
            answer: `Se refiere a realizar o recibir llamadas, enviar SMS, iniciar una sesión de datos o realizar el pago de tu plan.`
          },
          {
            question: '4.6 ¿Qué significa "Cancelar mi línea DIRECTV"?',
            answer: `Cancelar tu línea implica que tu SIM DIRECTV dejará de funcionar, perdiendo definitivamente tu número.`
          },
          {
            question: '4.7 ¿Qué debo hacer en caso de hurto o extravío de mi SIM y equipo?',
            answer: `Notifica de inmediato llamando a *888 (opción 4) o al 018000423690 para que bloqueemos el servicio. Luego, adquiere una nueva SIM DIRECTV en nuestro centro de servicio al cliente para recuperar tu número y recursos.`
          },
          {
            question: '4.8 ¿Dónde puedo hacer mis reclamaciones?',
            answer: `Puedes hacer tus reclamaciones llamando al *888 (opción 4) o al 018000423690. También puedes consultar el <a href="https://lov.com.co/directv/documents/procedimiento_y_tramites_pqr.pdf">Procedimiento y Trámite de PQR</a>.`
          },
          {
            question: '4.9 ¿Quién es el prestador del servicio?',
            answer: `El servicio es prestado por LOV Telecomunicaciones S.A.S. en convenio con DIRECTV Colombia Ltda.`
          },
          {
            question: '4.10 ¿Puedo usar mi SIM Directv Móvil en cualquier equipo?',
            answer: `Sí, siempre y cuando tu equipo esté registrado, no esté reportado como perdido o robado y esté homologado ante la CRC.`
          },
          {
            question: '4.11 ¿Cómo hacer que mis datos móviles duren más?',
            answer: `• Usa WiFi siempre que sea posible.<br>
• Desactiva la descarga automática de actualizaciones.<br>
• Elimina aplicaciones que no uses para evitar consumo en segundo plano.`
          },
          {
            question: '4.12 ¿La reposición de mi SIM DIRECTV tiene costo?',
            answer: `No, si el cambio se debe a daños ajenos a ti, solo comunícate al *888 (opción 4) y sigue las indicaciones. Tu nueva SIM conservará los recursos de la anterior y la vigencia del plan.`
          },
          {
            question: '4.13 ¿Cómo puedo cancelar mi línea DIRECTV?',
            answer: `Puedes cancelar tu línea en cualquier momento, pero debes ser el titular. Si cancelas, perderás tu número de forma definitiva. Para cancelar, llama al *888 (opción 4) o al 018000423690.`
          },
          {
            question: '4.14 ¿Cómo registrar mi equipo?',
            answer: `Registra tu equipo marcando *888 (opción 3) desde tu línea DIRECTV.`
          }
        ]
      }
    ];
  }

  toggleQuestion(index: number): void {
    // Cierra todas las preguntas excepto la que se haga clic
    this.faqs.forEach((faq, i) => {
      faq.open = i === index ? !faq.open : false;
    });
  }
}
