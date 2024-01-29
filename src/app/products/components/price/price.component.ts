import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css'],
})
export class PriceComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public price: number = 0;

  /* se coloca de tipo Subscription ya que lo que me retorna la suscripción al interval es de tipo Subscription. Se hace esto con la finalidad de poder suscribirnos y desuscribirnos para evitar afectar el rendimiento de nuestra aplicación con efectos no deseados */
  public intervalSubscription?: Subscription;

  ngOnInit(): void {
    console.log('PriceComponent: ngOnInit');

    /* este interval de RxJS es un observable que empieza a emitir valores de forma secuencial basado en un periodo de tiempo */
    this.intervalSubscription = interval(1000).subscribe((value) =>
      console.log(`Tick: ${value}`)
    );
    /* si se crearán listeners con window.addEventListener() también sería bueno que se remueven en el ngOnDestroy usando el window.removeEventListener() */
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('PriceComponent: ngOnChanges');
    console.log({ changes });
  }

  /* Se llama justo antes de que el componente o directiva va a ser destruida. Usualmente en esta parte del ciclo de vida de los componentes de Angular se usa para hacer limpiezas por ejemplo de suscripciones y no necesariamente con observables sino también puede ser con intérvalos de tiempo, algún tipo de petición que cree algún tipo de suscripción ,etc */
  ngOnDestroy(): void {
    console.log('PriceComponent: ngOnDestroy');
    /* cancelar la suscripción del observable */
    this.intervalSubscription?.unsubscribe();
  }
}

/* ******************************************************************************************************************* */
/* ¿Al destruirse un componente lo que persiste son las @Input y propiedades de la clase del componente? Porque si el componente se construye o destruye nuevamente entonces eso no afecta al valor del @Input price del componente price hijo ya que el valor del price reanuda a como estaba antes. Eso lleva a la pregunta de que entonces ¿El valor de un @Input persiste a pesar de que se destruye? ¿Y también sucede con las propiedades de una clase del componente? */
/*
No, si el componente es destruido la data que tengamos ahí no va a persistir. Ahora, estamos hablando de un único componente, en este caso PriceComponent es el que está destruyéndose y volviendo a construir, pero el componente padre, ProductComponent en ningún momento se está destruyendo, por lo que la data que tenga ProductComponent seguirá ahí, mientras que la de PriceComponent es eliminada.

Pero, ¿Por qué parece que el valor se mantiene?
Porque realmente "price" se lo estamos pasando desde ProductComponent a PriceCompoent usando [price]="currentPrice". Es decir, la variable currentPrice en todo momento se mantiene, ya que cuando se destruye PriceComponent, únicamente se destruye este y una vez vuelva a ser construido, como por el @Input le pasamos el valor de currentPrice este se mantiene actualizado.

Si se destruyera el componente ProductComponent ahí sí luego volvería al valor de 10 ya que es el por defecto al crearse, pero mientras este siga vigente, el valor se mantiene.


Por eso es importante que se identifique bien que únicamente se está destruyendo el componente hijo, el padre sigue ahí, por lo que persiste el estado, pero el valor de @Input no es persistente ni cualquier otra propiedad de clase, cuando estos componentes son destruidos y creados de nuevo volverá al valor por defecto que tuvieran (la persistencia la tenemos que agregar manualmente, como por ejemplo cuando se usa localStorage, o cuando en el onInit se hace una llamada a un endpoint para cargar la data, etc.
*/

/* ******************************************************************************************************************* */
/* ¿Siempre debo hacer el unsubscribe() de los observables cuando se ejecute el ngOnDestroy? en que ocasiones si y en cuales no? */
/*
Como tal no siempre es necesario, pero es algo más complejo que dar un sí o no. Realmente en las peticiones http no es obligatorio, el unsubscribe lo maneja la propia petición y se limpia sola una vez finaliza, por lo que en la mayoría de casos, no hará falta.

Ahora, el unsubscribe puede servir por ejemplo si una petición http está en curso en un modal y el usuario decide cerrar ese modal. En ese caso, puede que no quieras que termine esa petición http si el usuario sale antes de que terminara, por lo que ahí sí podrías tener un unsubscribe para prevenir esos casos.

En caso de duda, se puede añadir el unsubscribe() ya que te asegurarás que se limpie, pero al final depende del contexto en el que se esté y qué se esté usando.

Las peticiones http con el HttpClient se limpian solas una vez terminan, por lo que si ese siempre es el comportamiento esperado, ahí no haría falta.
*/

/* ******************************************************************************************************************* */
/* Para poder manejar componentes con varias subscripciones, se podría crear un array de tipo Subscription e ir haciendo push para agregar la subscripción */
/*
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    console.log('<< ngOnInit >>');
    const subscription: Subscription = interval(1000).subscribe(intervalValue => {
      const seconds = intervalValue;
      console.log(seconds);
    })

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    console.error('<< ngOnDestroy >>');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
*/

/* ******************************************************************************************************************* */
/* Algunas formas de desuscribirse y darse cuenta si funciona: */
/*
Una cosa que se puede hacer para saber si efectivamente se destruye el observable, es agregarle un pipe con un tap y console:

  segundos = 0;
  segundos2 = 0;

  subscripcion$!: Subscription
  ngOnInit(): void {
    console.log("pagina1 ngOnInit")
    const numbers$ = interval(1000);
    this.subscripcion$= numbers$.pipe(tap(()=>console.log("hola"))).subscribe(() => this.segundos++);
  }
  ngOnDestroy(): void {
    // si se comenta se seguiran mostrando los logs del tap
    this.subscripcion$.unsubscribe()
  }

  subscripciones$ = new Subscription()
  ngOnInit(): void {
    console.log("pagina1 ngOnInit")
    const numbers$ = interval(1000)
    const numbers2$ = interval(2000)

    this.subscripciones$.add(numbers$.pipe(tap(()=>console.count("numbers1"))).subscribe(()=>this.segundos++))
    this.subscripciones$.add(numbers2$.pipe(tap(()=>console.count("numbers2"))).subscribe(()=>this.segundos2++))

  }
  ngOnDestroy(): void {
    // si se comenta, se seguira mostrando los logs del tap
    this.subscripciones$.unsubscribe()
  }


En el template HTML basta con poner:

  <h2>Segundos: {{ segundos }}</h2>
  <h2>Segundos2: {{ segundos2 }}</h2>
*/
