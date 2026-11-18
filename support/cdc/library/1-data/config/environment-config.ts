import { BASE_URL } from '../../../base-url';

export const ENV = {
    BASE_URL: `${BASE_URL}/`,
    LOGIN_URL: `${BASE_URL}/ssologin`,
    PATHS: {
        HOME: "/home",
        MY_APPLICATION: "/web/epapp/my-application",
        DASHBOARD: "/web/epapp/dashboard",
    },
    LANGUAGE: "en_US",
    POST_LOGIN_WAIT_STATE: "networkidle" as const,
};

export function buildUrl(path: string): string {
    return `${BASE_URL}${path}`;
}
