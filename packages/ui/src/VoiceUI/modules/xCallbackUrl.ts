const normalizeCallbackUrl = (url: string | null) => {
    if (!url) {
        return null;
    }
    return ["javascript:", "vbscript:"].includes(new URL(url).protocol) ? null : url;
};
export const createXCallback = (href: string) => {
    const url = new URL(href);
    const xSuccess = normalizeCallbackUrl(url.searchParams.get("x-success"));
    const xCancel = normalizeCallbackUrl(url.searchParams.get("x-cancel"));
    const xError = normalizeCallbackUrl(url.searchParams.get("x-error"));
    return {
        get isOnetime() {
            return url.searchParams.has("x-onetime");
        },
        hasCallback(type: "success" | "cancel" | "error") {
            switch (type) {
                case "success":
                    return xSuccess !== null;
                case "cancel":
                    return xCancel !== null;
                case "error":
                    return xError !== null;
                default:
                    return false;
            }
        },
        success(result: string) {
            if (!xSuccess) {
                throw new Error("x-success is not defined");
            }
            location.href = xSuccess.split("{{result}}").join(encodeURIComponent(result));
        },
        error(errorMessage: string = "") {
            if (!xError) {
                throw new Error("x-error is not defined");
            }
            location.href = xError.split("{{errorMessage}}").join(encodeURIComponent(errorMessage));
        },
        cancel() {
            if (!xCancel) {
                throw new Error("x-cancel is not defined");
            }
            location.href = xCancel.toString();
        },
    };
};
