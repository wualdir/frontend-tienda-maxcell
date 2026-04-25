export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  user:{
    username:string;
    role:string;
  }
}

//para crear usuario 
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  mensaje: string;
}