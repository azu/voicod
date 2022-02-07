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
            const xSuccessUrl = new URL(xSuccess.replace("{{result}}", result));
            xSuccessUrl.searchParams.append("result", result);
            location.href = xSuccessUrl.toString();
        },
        error(errorMessage: string = "") {
            if (!xError) {
                throw new Error("x-error is not defined");
            }
            const xErrorUrl = new URL(xError.replace("{{errorMessage}}", errorMessage));
            xErrorUrl.searchParams.append("errorMessage", errorMessage);
            location.href = xError.toString();
        },
        cancel() {
            if (!xCancel) {
                throw new Error("x-cancel is not defined");
            }
            location.href = xCancel.toString();
        },
    };
};
