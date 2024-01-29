import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})

/* para los ciclos de vida de los componentes de Angular se tienen que implementar, es decir, usar la palabra reservada implements y esto le dice a Angular qué componente tiene a su disposición */
export class ProductPageComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  public isProductVisible: boolean = false;
  public handleVisible() {
    this.isProductVisible = !this.isProductVisible;
  }

  public currentPrice: number = 10;
  public handleIncreasePrice(): void {
    this.currentPrice++;
  }

  /* Se llama antes de cualquier ciclo de vida. */
  constructor() {
    console.log('ProductPageComponent: constructor');
  }

  /* Justo después del constructor. El ngOnInit debería dispararse después de la carga del HTML. */
  ngOnInit(): void {
    console.log('ProductPageComponent: ngOnInit');
  }

  /* Antes de cualquier cambio a una propiedad pero la propiedad que detecta este ngOnChanges no es la propiedad que tenemos de isProductVisible sino la que viene basada en un input pero no estamos hablando de un input de HTML sino de un input del @Input (mandarle argumentos a un componente hijo) */
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ProductPageComponent: ngOnChanges');
    console.log({ changes });
  }

  /* Se llama cada vez que una propiedad del componente o directiva es revisada. */
  ngDoCheck(): void {
    console.log('ProductPageComponent: ngDoCheck');
  }

  /* Después de ngOnInit, cuando el componente es inicializado. */
  ngAfterContentInit(): void {
    console.log('ProductPageComponent: ngAfterContentInit');
  }

  /* Se llama después de cada revisión del componente o directiva. */
  ngAfterContentChecked(): void {
    console.log('ProductPageComponent: ngAfterContentChecked');
  }

  /* Después del ngAfterContentInit. */
  ngAfterViewInit(): void {
    console.log('ProductPageComponent: ngAfterViewInit');
  }

  /* Llamado después de cada revisión de las vistas del componente o directiva. */
  ngAfterViewChecked(): void {
    console.log('ProductPageComponent: ngAfterViewChecked');
  }

  /* Se llama justo antes de que el componente o directiva va a ser destruida. */
  ngOnDestroy(): void {
    console.log('ProductPageComponent: ngOnDestroy');
  }
}

/* ******************************************************************************************************************* */
/*
El ciclo de vida de un componente se compone de varias etapas, y aunque el ngOnInit se ejecuta después del constructor y es adecuado para inicializaciones iniciales, hay situaciones en las que las propiedades pueden no estar cargadas al momento de la renderización del componente en la vista. Esto puede generar errores si intentamos acceder a esas propiedades antes de que estén disponibles.

Para evitar este problema, es recomendable realizar comprobaciones en la vista antes de utilizar esas propiedades, utilizando operadores seguros de navegación para evitar errores en caso de que las propiedades no estén definidas. Además, en casos donde la inicialización es asincrónica, como cuando se carga un valor desde un endpoint en el ngOnInit, es posible que la vista se renderice antes de que los datos estén disponibles. En estos casos, es útil utilizar directivas como *ngIf para condicionar la renderización de partes de la vista hasta que los datos estén listos, asegurando así que no haya errores debido a datos faltantes.
*/

/* Aquí tenemos dos razones por las que usamos el implements:
  - La primera, para tener el strong type checking que nos ofrece TypeScript, por lo que es una buena práctica añadirlo.
  - Y la segunda, a la hora de hacer el build de producción. Ten en cuenta que en desarrollo cargamos todos los módulos, pero al hacer el build angular intenta ser eficiente. Ten en cuenta eso ya que puede que en desarrollo algo nos funcione, pero luego en producción no. También para alguna herramienta de angular, hacer estadísticas, etc podría servir esta información.

Actualmente se podría decir que por defecto es indiferente, y podríamos agregar el ngOnInit sin el implements, pero es una buena práctica.
*/

/* ******************************************************************************************************************* */
/*
Estas implementaciones de:
  - ngAfterContentInit
  - ngAfterContentChecked
  - ngAfterViewInit
  - ngAfterViewChecked

Se usan muy pocas veces aunque sí se usan y algunos ejemplos podría ser cuando se utiliza algún paquete de terceros o plugin o algún sistema de gráficas como para recalcular las dimensiones que se tienen en pantalla.
*/

/* ******************************************************************************************************************* */
/* Limpieza en ngDestroy se comenta usar este método para hacer limpieza en caso de haber creado en el ngOnInit algún tipo de listener, observable, timer, etc.. La duda es ¿Solo se debe hacer esa limpieza si se crean en el ngOnInit o también si se implementan en algún otro método por ejemplo, al pulsar un botón llama un método que implementa un listener, observable o timer? */
/*
El uso del ngOnDestroy para limpiar recursos es especialmente importante cuando estos recursos se crean dentro del ciclo de vida del componente, como en ngOnInit. Sin embargo, también es recomendable utilizar ngOnDestroy para limpiar recursos que hayan sido creados en otros métodos del componente, como cuando un botón que llama a un método que implementa un listener, observable o timer. Esto te asegurará una gestión adecuada de los recursos y evitar fugas de memoria en la aplicación.
*/
