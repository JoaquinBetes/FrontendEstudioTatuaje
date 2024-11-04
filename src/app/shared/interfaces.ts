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