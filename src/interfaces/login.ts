export interface IdefaultData{
    showRegister: boolean;
    messageLoginStatus: {
      type: string;
      message: string;
    };
    messageRegisterStatus: {
      email: {
        type: string;
        message: string;
      };
    };
    loginData: {
      email: string;
      password: string;
    };
    registerData: {
      name: string;
      email: string;
      password: string;
      image: File | null;
    };
}