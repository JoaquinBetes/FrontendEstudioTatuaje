import { Component, inject } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import {HttpClient} from '@angular/common/http';
import { DatoSucursal } from '../shared/interfaces.js';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    HeaderTattoo,
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  private http = inject(HttpClient);
  pais: string = "";
  localidad: string = "";
  direccion: string = "";
  departamento: string = "";
  piso: number = 0;
  faqs = [
    {
      id: 1,
      pregunta: '¿Cómo debo cuidar mi tatuaje después de hacerlo?',
      respuesta: `
        <div class="tattoo-care-container">
          <h3>¿Cómo debo cuidar mi tatuaje después de hacerlo?</h2>
          <ol>
            <li>
              <h4>Limpieza inicial:</h4>
              <p>Después de hacerte el tatuaje, es importante seguir las instrucciones del tatuador para los primeros cuidados. En general, debes lavar el tatuaje con <strong>agua tibia</strong> y un <strong>jabón neutro</strong> o sin fragancia, de manera suave. Asegúrate de limpiar bien el área sin frotar ni rascar la piel. Esto ayuda a eliminar cualquier resto de tinta, sangre o fluido que pueda haber quedado sobre la piel.</p>
            </li>
            <li>
              <h4>Secado:</h4>
              <p>Después de lavar el tatuaje, <strong>seca la piel</strong> con una toalla limpia o, preferiblemente, con una gasa estéril. Evita frotar, ya que la piel está sensible y puede irritarse. Dóblalo ligeramente para absorber el exceso de agua, pero sin frotar.</p>
            </li>
            <li>
              <h4>Aplicación de crema cicatrizante:</h4>
              <p>Aplica una capa <strong>delgada</strong> de crema cicatrizante o pomada recomendada por tu tatuador, que puede ser vaselina, una crema específica para tatuajes o una crema hidratante sin fragancia. Es importante que no apliques demasiado producto, ya que la piel necesita respirar para sanar.</p>
            </li>
            <li>
              <h4>Evita tocar o rascar el tatuaje:</h4>
              <p>Durante el proceso de cicatrización, es común que el tatuaje se pueda picar o formar costras. Sin embargo, <strong>evita rascarlo o despegar las costras</strong>, ya que esto puede afectar la curación y la apariencia del tatuaje. Si sientes picazón, aplica un poco más de crema hidratante o cicatrizante.</p>
            </li>
            <li>
              <h4>Evita el sol directo:</h4>
              <p>Los <strong>rayos UV</strong> pueden dañar la piel recién tatuada y hacer que los colores del tatuaje se desvanezcan más rápido. <strong>Evita la exposición al sol</strong> directo durante las primeras semanas. Si necesitas salir al sol, asegúrate de usar un protector solar de alto factor (mínimo SPF 30) una vez que el tatuaje haya cicatrizado por completo, para protegerlo a largo plazo.</p>
            </li>
            <li>
              <h4>Evita el agua de piscinas y baños calientes:</h4>
              <p>Durante las primeras dos semanas, evita sumergir el tatuaje en agua caliente, como en piscinas, o baños largos. El contacto con el agua puede afectar la cicatrización y aumentar el riesgo de infección. <strong>Toma duchas cortas</strong> y asegúrate de que el tatuaje no esté sumergido en agua durante mucho tiempo.</p>
            </li>
            <li>
              <h4>Ropa cómoda:</h4>
              <p>Usar ropa ajustada sobre el tatuaje puede causar fricción y hacer que se irrite o se infecte. <strong>Usa ropa suelta</strong> y cómoda para que el área tatuada pueda sanar sin presión adicional.</p>
            </li>
            <li>
              <h4>No cubras el tatuaje innecesariamente:</h4>
              <p>Aunque es común cubrir el tatuaje con un vendaje durante las primeras horas, después de ese tiempo es preferible dejarlo al aire para que cicatrice correctamente. No uses envolturas plásticas o vendas más de lo necesario.</p>
            </li>
            <li>
              <h4>Vigila signos de infección:</h4>
              <p>Aunque es raro, las infecciones pueden ocurrir. Si notas enrojecimiento excesivo, calor, hinchazón, pus o dolor, es importante acudir a un profesional de la salud para que evalúe la situación. Recuerda que un tatuaje es una herida abierta, por lo que es esencial mantenerlo limpio y bien cuidado.</p>
            </li>
            <li>
              <h4>Proceso de cicatrización:</h4>
              <p>La cicatrización de un tatuaje puede tardar entre 2 a 4 semanas, dependiendo del tamaño y la ubicación. Durante este tiempo, la piel puede desprender pequeñas escamas o costras. Es fundamental no arrancarlas, ya que esto puede afectar el diseño del tatuaje.</p>
            </li>
          </ol>
        </div>
      `,
      mostrar: false,
    },
    {
      id: 2,
      pregunta: '¿Dónde está ubicado el estudio?',
      respuesta: '',
      mostrar: false,
    },
    {
      id: 3,
      pregunta: '¿Como se determina el precio final de un tatuaje?',
      respuesta: `
      <div class="tattoo-care-container">
        <h5>El precio final de un tatuaje se determina tomando en cuenta varios factores:</h5>
        <ol>
          <li>
          <h5>Precio base:</h5>
           <p>Cada tatuaje tiene un precio base, que es el punto de partida.</p>
           </li>
          <li>
          <h5>Descuentos:</h5>
          <p>Los descuentos se aplican sobre el precio base, según promociones o condiciones especiales.</p>
          </li>
          <li>
          <h5>Penalizaciones:</h5>
          <p>Si el cliente no asiste a un turno a su proximo tatuaje se le aplicara un aumento del 5% sobre el precio base.</p>
          </li>
          <li>
          <h5>Modificaciones:</h5>
          <p>Si el cliente decide hacer cambios en el diseño, como aumentar el tamaño, cambiar alguna parte del diseño, o agregar colores, el precio puede aumentar.</p>
           </li>
          <li>
          <h5>Ubicación del tatuaje:</h5>
          <p>El área del cuerpo donde se realice el tatuaje también influye en el precio final. Las zonas más complejas o que requieren mayor detalle pueden ser más caras.</p>
          </li>
          <li>
          <h5>Crema anestésica:</h5>
          <p>Si el cliente requiere crema anestésica para hacer más cómodo el proceso, también se sumará al precio final.</p>
           </li>
        </ol>
        <p>Es importante tener en cuenta todos estos factores durante la consulta para obtener una estimación precisa del precio final.</p>
      </div>
    `,
      mostrar: false,
    },
  ];

  toggleFaq(id: number): void {
    this.faqs = this.faqs.map(faq =>
      faq.id === id ? { ...faq, mostrar: !faq.mostrar } : faq
    );
  }

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/sucursal/2`).subscribe(
      (response: any) => {
        this.localidad = response.data.localidad;
        this.pais = response.data.pais;
        this.direccion = response.data.direccion;
        this.departamento = response.data.departamento;
        this.piso = response.data.piso;

        // Actualiza la respuesta de la pregunta de ubicación con los datos obtenidos
        const respuestaUbicacion = `
          <div class="location-info">
            <p><h5>Dirección:</h5> ${this.direccion}</p>
            <p><h5>Localidad:</h5> ${this.localidad}</p>
            <p><h5>Departamento:</h5> ${this.departamento}</p>
            <p><h5>Piso:</h5> ${this.piso}</p>
            <p><h5>País:</h5> ${this.pais}</p>
          </div>
        `;

        // Asigna la respuesta a la pregunta de la ubicación
        this.faqs[1].respuesta = respuestaUbicacion;
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
  }

}



