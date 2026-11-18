// Host for the CDC page objects, from TEST_ENV (same rule as config/environments.ts: no default).
const HOSTS: Record<string, string> = {
  SIT: 'http://ngepsit.eperolehan.com.my',
  UAT: 'http://ngepuat.eperolehan.com.my',
};

const envName = (process.env.TEST_ENV ?? '').trim().toUpperCase();
if (!HOSTS[envName]) {
  throw new Error(`TEST_ENV must be SIT or UAT (got "${envName || '<unset>'}") before the CDC page objects can be used`);
}

/** e.g. http://ngepsit.eperolehan.com.my (no trailing slash). */
export const BASE_URL = HOSTS[envName];
