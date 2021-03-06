interface IApiProps {
    url: string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    body?: Object;
}


export const api = async ({ url, method, body }: IApiProps): Promise<Response> => {

    const requestConfig = { method };

    body &&
        Object.assign(requestConfig, { body })

    return await fetch(`http://localhost:3000/api${url}`, requestConfig);
}