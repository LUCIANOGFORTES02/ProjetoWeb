//Sucesso e erro 
//Interceptar de uma forma global  
import axios from 'axios'

const success = res => res //Receber a resposta e retornar a resporta
const error = err =>{
    if(401 === err.response.status){
        window.location = '/' //Redirecionado para a raiz do aplicativo 

    }else{
        return Promise.reject(err)//Rejeita a promise
    }
}
//Configura um interceptor de resposta global
axios.interceptors.response.use(success, error)//Este receptor é responsável por chamar a função success quando uma solicitação HTTP é bem-sucedida (2xx)e a função 'error' quando ocorre um erro na resposta (4xx ou 5xx).
