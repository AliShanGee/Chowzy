import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('authToken');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

const getResourceUrl = (resource) => resource === 'orders' ? `${apiUrl}/admin/orders` : `${apiUrl}/${resource}`;

const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${getResourceUrl(resource)}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            if (!headers.has('content-range')) {
                return {
                    data: json,
                    total: json.length,
                };
            }
            const contentRange = headers.get('content-range').split('/');
            const total = parseInt(contentRange.pop(), 10);
            return {
                data: json,
                total: total,
            };
        });
    },

    getOne: (resource, params) =>
        httpClient(`${getResourceUrl(resource)}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${getResourceUrl(resource)}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${getResourceUrl(resource)}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            if (!headers.has('content-range')) {
                throw new Error(
                    'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                );
            }
            return {
                data: json,
                total: parseInt(
                    headers.get('content-range').split('/').pop(),
                    10
                ),
            };
        });
    },

    update: (resource, params) =>
        httpClient(`${getResourceUrl(resource)}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    create: (resource, params) =>
        httpClient(`${getResourceUrl(resource)}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${getResourceUrl(resource)}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${getResourceUrl(resource)}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    },
};

export default dataProvider;