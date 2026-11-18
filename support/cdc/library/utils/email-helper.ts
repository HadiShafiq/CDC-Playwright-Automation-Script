import { ImapFlow } from "imapflow";
import { simpleParser, ParsedMail } from "mailparser";
import { faker } from "@faker-js/faker";

// ============================================================
// GMAIL IMAP CONFIG
// ============================================================
const GMAIL_CONFIG = {
    HOST: "imap.gmail.com",
    PORT: 993,
    // Guna environment variables — JANGAN hardcode credentials
    USER: process.env.GMAIL_USER || "testingredmagic@gmail.com",
    // PENTING: Ini mesti App Password, BUKAN password biasa Gmail
    // Generate di: https://myaccount.google.com/apppasswords
    PASS: process.env.GMAIL_APP_PASSWORD || "",
};

// ============================================================
// INTERFACES
// ============================================================
export interface ActivationEmailResult {
    activationLink: string;
    activationKey: string;
}

export interface FirstLoginEmailResult {
    oldPassword: string;
}

// ============================================================
// EXTRACTION HELPERS
// ============================================================

/**
 * Extract activation link from email body (HTML or plain text).
 *
 * Pattern in email:
 *   <a href="http://ngepsit.eperolehan.com.my/web/guest/supplier-user-activation?pr=...&sp=...&kp=...&ct=...">
 */
function extractActivationLink(body: string): string {
    // Pattern 1: href attribute (HTML email)
    const hrefMatch = body.match(
        /href=["']?(http[^"'\s]*supplier-user-activation\?[^"'\s]*)["']?/
    );
    if (hrefMatch?.[1]) {
        // Clean up any HTML entities
        return hrefMatch[1]
            .replace(/&amp;/g, "&")
            .replace(/[">)\s]+$/, "");
    }

    // Pattern 2: bare URL (plain text email)
    const bareMatch = body.match(
        /(https?:\/\/[^\s<>"]*supplier-user-activation\?[^\s<>"]*)/
    );
    if (bareMatch?.[1]) {
        return bareMatch[1].replace(/[">)\s]+$/, "");
    }

    throw new Error("[EmailHelper] Activation link not found in email body");
}

/**
 * Extract activation key from email body.
 *
 * Pattern: "Activation Key: jSLTS7cAi6i0Xw0"
 */
function extractActivationKey(body: string): string {
    // English: "Activation Key: xxx"
    // BM: "Kod Pengaktifan : xxx"
    const match = body.match(
        /(?:Activation\s*Key?|Kod\s*Pengaktifan)\s*:\s*([A-Za-z0-9]+)/i
    );
    if (match?.[1]) return match[1].trim();
    throw new Error("[EmailHelper] Activation key not found in email body");
}

/**
 * Extract first-time login password from email body.
 *
 * Pattern: "Password : d3l4vGIS-U8r"
 */
function extractOldPassword(body: string): string {
    // Match "Temporary Password:" specifically, require 4+ chars
    // (elak match "password :-" dalam intro sentence)
    const match = body.match(
        /Temporary\s+Password\s*:\s*([A-Za-z0-9@#$%^&*!_\-+.]{4,})/i
    );
    if (match?.[1]) return match[1].trim();
    throw new Error("[EmailHelper] Old password not found in email body");
}

// ============================================================
// HELPER: Get email body text from parsed email
// ============================================================
function getEmailBody(parsed: ParsedMail): string {
    // Prefer HTML body (lebih lengkap, ada href links)
    if (parsed.html) {
        return typeof parsed.html === "string" ? parsed.html : "";
    }
    // Fallback ke plain text
    if (parsed.text) {
        return parsed.text;
    }
    throw new Error("[EmailHelper] Email has no readable body content");
}

// ============================================================
// MAIN HELPER CLASS
// ============================================================
export class EmailHelper {
    /**
     * Generate a random Login ID (used during activation).
     * Format: 16 chars alphanumeric uppercase.
     */
    generateLoginId(): string {
        return faker.string.alphanumeric({ length: 16, casing: "upper" });
    }

    // ==========================================================
    // PRIVATE: Create IMAP client
    // ==========================================================
    private createClient(): ImapFlow {
        if (!GMAIL_CONFIG.PASS) {
            throw new Error(
                "[EmailHelper] GMAIL_APP_PASSWORD not set. " +
                "Set it in .env or environment variables. " +
                "Generate App Password at: https://myaccount.google.com/apppasswords"
            );
        }

        return new ImapFlow({
            host: GMAIL_CONFIG.HOST,
            port: GMAIL_CONFIG.PORT,
            secure: true,
            auth: {
                user: GMAIL_CONFIG.USER,
                pass: GMAIL_CONFIG.PASS,
            },
            logger: false, // Set to true for debug logging
        });
    }

    // ==========================================================
    // PRIVATE: Poll Gmail via IMAP for matching email
    // ==========================================================
    private async pollForEmail(
        subjectKeyword: string,
        recipientEmail: string,
        maxWaitMs: number,
        pollIntervalMs: number,
        type: "activation" | "firstlogin"
    ): Promise<ActivationEmailResult | FirstLoginEmailResult> {
        const startTime = Date.now();
        let attempt = 0;

        while (Date.now() - startTime < maxWaitMs) {
            attempt++;
            console.log(
                `[EmailHelper] Attempt ${attempt} — searching Gmail for "${subjectKeyword}"...`
            );

            const client = this.createClient();

            try {
                await client.connect();
                const lock = await client.getMailboxLock("INBOX");

                try {
                    // --- Search by subject keyword ---
                    // IMAP SEARCH: find emails with matching subject
                    // Gmail juga support 'to' filter kalau perlu
                    const searchCriteria: any = {
                        subject: subjectKeyword,
                    };

                    // Optional: filter by recipient (useful kalau Gmail
                    // receive forwarded emails dari multiple addresses)
                    if (recipientEmail) {
                        searchCriteria.to = recipientEmail;
                    }

                    const messages = await client.search(searchCriteria);

                    // search() returns number[] or false
                    if (messages && Array.isArray(messages) && messages.length > 0) {
                        console.log(
                            `[EmailHelper] Found ${messages.length} matching email(s). Reading newest...`
                        );

                        // Take the LAST element = newest email (IMAP returns oldest first)
                        const latestSeq = messages[messages.length - 1];
                        const fetchResult = await client.fetchOne(
                            String(latestSeq),
                            {
                                source: true, // Full raw email source
                            }
                        );

                        // fetchOne() returns FetchMessageObject or false
                        if (fetchResult && fetchResult.source) {
                            // Parse the raw MIME email
                            const parsed = await simpleParser(fetchResult.source);

                            try {
                                if (type === "activation") {
                                    // Activation: guna HTML body (ada href links)
                                    const body = getEmailBody(parsed);
                                    const activationLink = extractActivationLink(body);
                                    const activationKey = extractActivationKey(body);

                                    console.log(`[EmailHelper] ✅ Activation Key: ${activationKey}`);
                                    console.log(`[EmailHelper] ✅ Link: ${activationLink.substring(0, 80)}...`);

                                    return { activationLink, activationKey };
                                } else {
                                    // First login: guna PLAIN TEXT body
                                    // (HTML body ada tags/entities yang kacau regex)
                                    const body = parsed.text || getEmailBody(parsed);
                                    const oldPassword = extractOldPassword(body);
                                    console.log(`[EmailHelper] ✅ Old Password: ${oldPassword}`);
                                    return { oldPassword };
                                }
                        
                            } catch (extractError) {
                                console.warn(
                                    `[EmailHelper] Found email but extraction failed:`,
                                    extractError
                                );
                                // Continue polling — mungkin email yang salah matched
                            }
                        }
                    }
                } finally {
                    lock.release();
                }

                await client.logout();
            } catch (connError) {
                console.warn(
                    `[EmailHelper] IMAP connection error:`,
                    connError
                );
                // Try to disconnect gracefully
                try {
                    await client.logout();
                } catch {
                    // Ignore logout errors
                }
            }

            console.log(
                `[EmailHelper] Not found yet. Retry in ${pollIntervalMs / 1000}s...`
            );

            // Wait before next attempt
            await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        }

        throw new Error(
            `[EmailHelper] Email "${subjectKeyword}" not found after ${maxWaitMs / 1000}s`
        );
    }

    // ==========================================================
    // GET ACTIVATION EMAIL
    // ==========================================================
    /**
     * Poll Gmail via IMAP for the activation email.
     *
     * Flow:
     *   1. Connect ke Gmail IMAP (imap.gmail.com:993)
     *   2. Search INBOX by subject keyword
     *   3. Fetch newest matching email
     *   4. Parse MIME content (mailparser handles quoted-printable automatically)
     *   5. Extract activation link + key dari body
     *   6. Disconnect
     *
     * @param subjectKeyword  - text to match in subject (e.g. "Account Activation for")
     * @param recipientEmail  - the email address used in the form (filters by "To")
     * @param maxWaitMs       - max polling duration (default 5 min)
     * @param pollIntervalMs  - retry interval (default 15s)
     */
    async getActivationDetails(
        subjectKeyword: string,
        recipientEmail: string,
        maxWaitMs: number = 650000,
        pollIntervalMs: number = 15000
    ): Promise<ActivationEmailResult> {
        return (await this.pollForEmail(
            subjectKeyword,
            recipientEmail,
            maxWaitMs,
            pollIntervalMs,
            "activation"
        )) as ActivationEmailResult;
    }

    // ==========================================================
    // GET FIRST-TIME LOGIN PASSWORD (second email)
    // ==========================================================
    /**
     * After activation, system sends second email with first-time login password.
     * Subject contains the login ID.
     */
    async getFirstLoginPassword(
        loginId: string,
        recipientEmail: string,
        maxWaitMs: number = 650000,
        pollIntervalMs: number = 15000
    ): Promise<FirstLoginEmailResult> {
        return (await this.pollForEmail(
            loginId,
            recipientEmail,
            maxWaitMs,
            pollIntervalMs,
            "firstlogin"
        )) as FirstLoginEmailResult;
    }

    /**
 * Poll Gmail via IMAP by subject, return body text (no extraction).
 * Generic version untuk field-assertion (mcm verify deactivation email).
 *
 * Return plain-text body (mailparser auto-decode QP, so soft break dah hilang),
 * fallback ke HTML kalau takde plain text part.
 *
 * @param recipientEmail - tapis ikut "To" header. Pass "" kalau nak skip
 *                         (rely on subject je — selamat sebab subject ada
 *                          companyName + epNo, unik).
 */
async getEmailBodyBySubject(
    subjectKeyword: string,
    recipientEmail: string,
    maxWaitMs: number = 650000,
    pollIntervalMs: number = 15000
): Promise<string> {
    const startTime = Date.now();
    let attempt = 0;

    while (Date.now() - startTime < maxWaitMs) {
        attempt++;
        console.log(`[EmailHelper] Attempt ${attempt} — searching Gmail for "${subjectKeyword}"...`);

        const client = this.createClient();

        try {
            await client.connect();
            const lock = await client.getMailboxLock("INBOX");

            try {
                const searchCriteria: any = { subject: subjectKeyword };
                if (recipientEmail) searchCriteria.to = recipientEmail;

                const messages = await client.search(searchCriteria);

                if (messages && Array.isArray(messages) && messages.length > 0) {
                    const latestSeq = messages[messages.length - 1]; // newest
                    const fetchResult = await client.fetchOne(String(latestSeq), { source: true });

                    if (fetchResult && fetchResult.source) {
                        const parsed = await simpleParser(fetchResult.source);
                        // Plain text lebih selamat untuk substring match
                        // (HTML body ada tags yang boleh pecahkan field)
                        const body = parsed.text || getEmailBody(parsed);
                        console.log(`[EmailHelper] ✅ Email found (subject: "${subjectKeyword}")`);
                        return body;
                    }
                }
            } finally {
                lock.release();
            }

            await client.logout();
        } catch (connError) {
            console.warn(`[EmailHelper] IMAP connection error:`, connError);
            try { await client.logout(); } catch { /* ignore */ }
        }

        console.log(`[EmailHelper] Not found yet. Retry in ${pollIntervalMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(`[EmailHelper] Email "${subjectKeyword}" not found after ${maxWaitMs / 1000}s`);
}
}

// Export extraction functions for unit testing
export {
    extractActivationLink,
    extractActivationKey,
    extractOldPassword,
};