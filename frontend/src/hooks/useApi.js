import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useEffect } from 'react';


function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function useApi(isDisplay=false) {

    const navigate = useNavigate()

	const controller = new AbortController()

	const source = axios.CancelToken.source();
	const instance = axios.create({
		baseURL: 'http://localhost:8000/',
		withCredentials: true,
		cancelToken: source.token,
		signal: controller.signal,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
	});

	instance.defaults.headers.put['X-CSRFToken'] = getCookie('csrftoken')
    instance.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken')
    instance.defaults.headers.delete['X-CSRFToken'] = getCookie('csrftoken')

    instance.interceptors.response.use(
		function (rsp) {
			const is_success = rsp?.data?.is_success;
			const text = rsp?.data?.description;

			if (is_success) {
				// var type = 'success'
				if(rsp?.data['info'] === 'INF_001'){
					alert(text)
				}
			}

			else {
				if (rsp?.data['info'] === 'ERR_001') {
					alert(text)
				}
				if (rsp?.data['info'] === 'ERR_002'){
					navigate('/login')
				}
			}

			return rsp?.data
		},
		function (error) {
			var err = error?.response?.data
			var status_code = error?.response?.status

            if ([401, 403].indexOf(status_code) !== -1) {
                navigate('/login')
            }
			else {
				if (!isDisplay) {
					alert('Алдаа гарлаа')
				}
            }
            return Promise.reject(err);
        }
    );

    return {
        source,
        instance,
        root: {
            login: (data) => instance.post(`/root/login/`, data),
            logged: () => instance.get(`/root/logged/`),
            logout: () => instance.get(`/root/logout/`),
			test: () => instance.get(`/root/test/`),
			systemdata: (search) => instance.get(`/root/systemdata/?search=${search}`),
        },
		createUser: {
			post: (data) => instance.post(`root/createuser/`, data)
		}
    }
}

export default useApi;