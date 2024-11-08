export interface Tatuador {
  contraseña: string;
  dni: number;
  email: string;
  redesSociales: string;
  nombreCompleto: string;
  telefono: number;
  turnos: any[];
}

export interface ResponseTatuadores {
  message: string;           // Mensaje que describe la respuesta
  data: Tatuador[];         // Lista de tatuadores
}

export interface ClienteResponse {
    message: string;
    data: {
      contraseña: string;
      dni: number;
      email: string;
      estado: number;
      nombreCompleto: string;
      telefono: number;
      turnos: any[];
    };
  }

  export interface TatuadorResponse {
    message: string;
    data: {
      contraseña: string;
      dni: number;
      email: string;
      redesSociales: string;
      nombreCompleto: string;
      telefono: number;
      turnos: any[];
    };
  }

  export interface DatoSucursal {
    nombreDato: 'pais' | 'localidad' | 'direccion' | 'departamento' | 'piso'; // Claves específicas
    dato: string | number | null;
  }

  export interface DatoHorariosAtencion {
    id: number;
    diaSeamana: string;       
    horaApertura: number;    
    horaCierre: number;      
  }

  export interface Categoria {
    codigo: number;
    descripcion: string;
  }

  interface Imagen {
    type: string;
    data: number[];
    base64String?: any;
  }

  export interface Diseño {
    id: number;
    categoria: Categoria;
    tatuador: Tatuador;
    imagen: string;
    descuento: number;
    precioBase: number;
    precioFinal?: number;
    tamanioAproximado: number;
    colores: string;
    estado: string;
    turno?: any;
  }